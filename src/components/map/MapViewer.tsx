import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { MapDTO } from '../../api/maps';
import { ProductDetailsDTO } from '../../api/inventory';

interface MapViewerProps {
  mapData: MapDTO | null;
  selectedProducts: ProductDetailsDTO[];
  showHeatMap: boolean;
}

const MapViewer: React.FC<MapViewerProps> = ({ mapData, selectedProducts, showHeatMap }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (mapData && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = Number(mapData.width);
      canvas.height = Number(mapData.height);
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        ctx.translate(position.x, position.y);
        ctx.scale(scale, scale);
        
        ctx.strokeStyle = 'black';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
        mapData.zones?.forEach(zone => {
          try {
            const shapeObj = JSON.parse(zone.shape);
            const points: { x: number; y: number }[] = shapeObj.points;
            
            if (points && points.length > 0) {
              ctx.beginPath();
              ctx.moveTo(points[0].x, points[0].y);
              
              for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
              }
              
              ctx.closePath();
              
              if (showHeatMap && zone.isNotified) {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
              } else {
                ctx.fillStyle = 'rgba(0, 128, 255, 0.3)';
              }
              
              ctx.fill();
              ctx.strokeStyle = 'blue';
              ctx.stroke();
              
              ctx.font = '12px Arial';
              ctx.fillStyle = 'black';
              
              let centerX = 0;
              let centerY = 0;
              
              points.forEach(point => {
                centerX += point.x;
                centerY += point.y;
              });
              
              centerX /= points.length;
              centerY /= points.length;
              
              ctx.fillText(zone.name, centerX, centerY);
            }
          } catch (e) {
            console.error('Error parsing zone shape', e);
          }
        });
        
        selectedProducts.forEach(product => {
          const { coordinateX, coordinateY } = product.coordinates;
          
          ctx.beginPath();
          ctx.arc(coordinateX, coordinateY, 8, 0, 2 * Math.PI);
          ctx.fillStyle = 'red';
          ctx.fill();
          ctx.strokeStyle = 'darkred';
          ctx.stroke();
          
          ctx.font = '12px Arial';
          ctx.fillStyle = 'black';
          ctx.fillText(`${product.inventoryId} - ${product.productName}`, coordinateX + 10, coordinateY);
        });
        
        if (showHeatMap) {
          const zoneCounts: Record<number, number> = {};
          
          mapData.zones?.forEach(zone => {
            zoneCounts[zone.zoneId] = 0;
          });
          
          selectedProducts.forEach(product => {
            const { coordinateX, coordinateY } = product.coordinates;
            
            mapData.zones?.forEach(zone => {
              try {
                const shapeObj = JSON.parse(zone.shape);
                const points: { x: number; y: number }[] = shapeObj.points;
                
                if (points && points.length > 0 && isPointInPolygon(coordinateX, coordinateY, points)) {
                  zoneCounts[zone.zoneId] = (zoneCounts[zone.zoneId] || 0) + 1;
                }
              } catch (e) {
                console.error('Error parsing zone shape', e);
              }
            });
          });
          
          mapData.zones?.forEach(zone => {
            try {
              const shapeObj = JSON.parse(zone.shape);
              const points: { x: number; y: number }[] = shapeObj.points;
              
              if (points && points.length > 0) {
                const count = zoneCounts[zone.zoneId] || 0;
                
                if (count === 0) return;
                
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                
                for (let i = 1; i < points.length; i++) {
                  ctx.lineTo(points[i].x, points[i].y);
                }
                
                ctx.closePath();
                
                const intensity = Math.min(count / 5, 1); // 5+ items = max intensity
                const r = 255;
                const g = Math.floor(255 * (1 - intensity));
                const b = 0;
                
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.4)`;
                ctx.fill();
              }
            } catch (e) {
              console.error('Error parsing zone shape', e);
            }
          });
        }
        
        ctx.restore();
      }
    }
  }, [mapData, selectedProducts, scale, position, showHeatMap]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setIsDragging(true);
      setDragStart({ x, y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setPosition(prev => ({
        x: prev.x + (x - dragStart.x),
        y: prev.y + (y - dragStart.y)
      }));
      
      setDragStart({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const isPointInPolygon = (x: number, y: number, polygon: { x: number; y: number }[]) => {
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x;
      const yi = polygon[i].y;
      const xj = polygon[j].x;
      const yj = polygon[j].y;
      
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      
      if (intersect) inside = !inside;
    }
    
    return inside;
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Box 
        ref={containerRef}
        sx={{ 
          width: '100%', 
          height: '500px', 
          overflow: 'hidden',
          border: '1px solid #ccc',
          borderRadius: '4px',
          position: 'relative'
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ 
            cursor: isDragging ? 'grabbing' : 'grab',
            transformOrigin: '0 0'
          }}
        />
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mt: 1, 
        gap: 2 
      }}>
        <Typography>Zoom:</Typography>
        <IconButton onClick={handleZoomOut} size="small">
          <ZoomOutIcon />
        </IconButton>
        
        <Slider
          value={scale}
          min={0.5}
          max={5}
          step={0.1}
          onChange={(_, newValue) => setScale(newValue as number)}
          sx={{ mx: 2, maxWidth: 200 }}
        />
        
        <IconButton onClick={handleZoomIn} size="small">
          <ZoomInIcon />
        </IconButton>
        
        <IconButton onClick={handleReset} size="small">
          <RestartAltIcon />
        </IconButton>
        
        <Typography sx={{ ml: 2 }}>
          {Math.round(scale * 100)}%
        </Typography>
      </Box>
    </Box>
  );
};

export default MapViewer;
