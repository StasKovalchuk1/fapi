import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';

interface ReportAnalysisDialogProps {
  open: boolean;
  onClose: () => void;
}

const ReportAnalysisDialog: React.FC<ReportAnalysisDialogProps> = ({ open, onClose }) => {
  const [reportType, setReportType] = useState('inventory');
  const [dateRange, setDateRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setResult(`Analysis report for ${reportType} generated successfully! Data covers ${dateRange || 'all time'}.`);
      setLoading(false);
    }, 1500);
  };

  const handleClose = () => {
    setResult(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Generate Analysis Report</DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              label="Report Type"
              onChange={(e) => setReportType(e.target.value)}
            >
              <MenuItem value="inventory">Inventory Status</MenuItem>
              <MenuItem value="movement">Item Movement</MenuItem>
              <MenuItem value="overstock">Overstock Analysis</MenuItem>
              <MenuItem value="efficiency">Storage Efficiency</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Date Range (optional)"
            variant="outlined"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            placeholder="e.g., Last 30 days"
            sx={{ mb: 2 }}
          />
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          ) : result ? (
            <Typography variant="body1" sx={{ my: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
              {result}
            </Typography>
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
        >
          Generate Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportAnalysisDialog;
