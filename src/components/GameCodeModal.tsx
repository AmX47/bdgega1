import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { redeemGameCode } from '../lib/gameSystem';

interface GameCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GameCodeModal({ isOpen, onClose, onSuccess }: GameCodeModalProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!code) {
      setError('الرجاء إدخال الكود');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await redeemGameCode(code);
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('حدث خطأ أثناء تفعيل الكود');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        dir="rtl"
        PaperProps={{
          style: {
            background: 'linear-gradient(to bottom right, #800020, #A0455A)',
            borderRadius: '16px',
          },
          component: motion.div,
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          color: '#F5DEB3',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          pt: 3
        }}>
          إضافة كود الألعاب
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            p: 2
          }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TextField
                fullWidth
                placeholder="أدخل الكود هنا"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                error={!!error}
                helperText={error}
                dir="ltr"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '12px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#FFB6C1',
                    fontWeight: 'bold',
                  }
                }}
              />
            </motion.div>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          justifyContent: 'center', 
          pb: 4,
          px: 3
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ width: '100%' }}
          >
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
              fullWidth
              sx={{
                background: 'linear-gradient(to right, #F5DEB3, #800020)',
                color: 'white',
                fontSize: '1.1rem',
                py: 1.5,
                borderRadius: '12px',
                '&:hover': {
                  background: 'linear-gradient(to left, #F5DEB3, #800020)',
                },
                '&:disabled': {
                  background: 'rgba(255, 255, 255, 0.3)',
                  color: 'rgba(255, 255, 255, 0.5)',
                }
              }}
            >
              {isLoading ? 'جاري التحقق...' : 'تطبيق'}
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="success"
          sx={{ 
            background: '#800020',
            color: '#F5DEB3',
            '& .MuiAlert-icon': {
              color: '#F5DEB3'
            }
          }}
        >
          تم تفعيل الكود بنجاح!
        </Alert>
      </Snackbar>
    </>
  );
}
