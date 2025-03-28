import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  currentPage: string;
}

export const ReportDialog: React.FC<ReportDialogProps> = ({ open, onClose, currentPage }) => {
  const [email, setEmail] = useState('');
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleSubmit = async () => {
    if (!email || !problem) {
      setSnackbarMessage('الرجاء تعبئة جميع الحقول');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
      return;
    }

    setLoading(true);

    try {
      const webhookUrl = 'https://discord.com/api/webhooks/1353919740875116565/fmLgaqWhoDEqGkaSLiAyV6pEjI9uFfngJg3vJhnZ4ANLXOdH-cNZ3Fp4v38PDrhTe9A8';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          embeds: [{
            title: '🚨 تقرير مشكلة جديد',
            color: 0xFF0000,
            fields: [
              {
                name: 'البريد الإلكتروني',
                value: email,
                inline: true
              },
              {
                name: 'الصفحة',
                value: currentPage,
                inline: true
              },
              {
                name: 'المشكلة',
                value: problem
              }
            ],
            timestamp: new Date().toISOString()
          }]
        }),
      });

      if (!response.ok) throw new Error('فشل إرسال التقرير');

      setSnackbarMessage('تم إرسال التقرير بنجاح');
      setSnackbarSeverity('success');
      setShowSnackbar(true);
      
      setEmail('');
      setProblem('');
      
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      setSnackbarMessage('حدث خطأ أثناء إرسال التقرير');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        dir="rtl"
        PaperProps={{
          sx: {
            backgroundColor: '#800020',
            color: '#F5DEB3',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(245, 222, 179, 0.1)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            textAlign: 'center',
            borderBottom: '1px solid rgba(245, 222, 179, 0.1)',
            padding: '20px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <WarningAmberIcon sx={{ color: '#F5DEB3' }} />
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>الإبلاغ عن مشكلة</span>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#F5DEB3',
              '&:hover': {
                backgroundColor: 'rgba(245, 222, 179, 0.1)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ padding: '24px' }}>
          <div className="space-y-6">
            <TextField
              autoFocus
              label="البريد الإلكتروني"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#F5DEB3',
                  backgroundColor: 'rgba(245, 222, 179, 0.05)',
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: 'rgba(245, 222, 179, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(245, 222, 179, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#F5DEB3',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#F5DEB3',
                  '&.Mui-focused': {
                    color: '#F5DEB3',
                  },
                },
                marginBottom: 3
              }}
            />
            
            <TextField
              label="شنو   المشكلة؟"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#F5DEB3',
                  backgroundColor: 'rgba(245, 222, 179, 0.05)',
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: 'rgba(245, 222, 179, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(245, 222, 179, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#F5DEB3',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#F5DEB3',
                  '&.Mui-focused': {
                    color: '#F5DEB3',
                  },
                },
              }}
            />
          </div>
        </DialogContent>

        <DialogActions 
          sx={{ 
            justifyContent: 'center', 
            padding: '20px',
            borderTop: '1px solid rgba(245, 222, 179, 0.1)',
            gap: 2
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              color: '#F5DEB3',
              borderColor: 'rgba(245, 222, 179, 0.5)',
              backgroundColor: 'transparent',
              borderRadius: '8px',
              padding: '8px 24px',
              '&:hover': {
                borderColor: '#F5DEB3',
                backgroundColor: 'rgba(245, 222, 179, 0.1)',
              },
            }}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{
              backgroundColor: '#F5DEB3',
              color: '#800020',
              borderRadius: '8px',
              padding: '8px 24px',
              '&:hover': {
                backgroundColor: '#F5DEB3',
                opacity: 0.9,
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(245, 222, 179, 0.3)',
              }
            }}
          >
            {loading ? 'جاري الإرسال...' : 'إرسال'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ 
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
