import React, { useState, ChangeEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

interface CategorySuggestionDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CategorySuggestionDialog: React.FC<CategorySuggestionDialogProps> = ({
  open,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = {
        name,
        categoryName,
        description,
        timestamp: new Date().toISOString(),
      };

      const webhookUrl = 'https://discord.com/api/webhooks/1352615750317244426/H01kDmqhH0QSN1pzSn_niRpl9nswbdJ2ULqfBjxHkK6XJqHeDBaphI_220Z098KitJC9';
      
      const messageContent = {
        content: '🆕 اقتراح فئة جديدة!',
        embeds: [{
          title: '🏷️ ' + categoryName,
          fields: [
            { name: 'المقترح', value: name, inline: true },
            { name: 'الوصف', value: description || 'لا يوجد وصف', inline: false },
          ],
          color: 3447003,
          timestamp: formData.timestamp
        }]
      };

      if (image) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          if (e.target?.result) {
            messageContent.embeds[0].image = {
              url: 'attachment://image.png'
            };

            const formDataWithImage = new FormData();
            formDataWithImage.append('payload_json', JSON.stringify(messageContent));
            formDataWithImage.append('file', image, 'image.png');

            await fetch(webhookUrl, {
              method: 'POST',
              body: formDataWithImage,
            });
          }
        };
        reader.readAsDataURL(image);
      } else {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageContent),
        });
      }

      onClose();
      setName('');
      setCategoryName('');
      setDescription('');
      setImage(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error sending suggestion:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, rgba(128, 0, 32, 0.95) 0%, rgba(70, 0, 17, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          color: '#F5DEB3'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          textAlign: 'center', 
          fontWeight: 'bold',
          fontSize: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px'
        }}
      >
        🌟 اقتراح فئة جديدة
      </DialogTitle>
      <DialogContent sx={{ padding: '24px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          <TextField
            label="اسمك"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            dir="rtl"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#F5DEB3',
                '& fieldset': {
                  borderColor: 'rgba(245, 222, 179, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(245, 222, 179, 0.5)',
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
          <TextField
            label="اسم الفئة"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            fullWidth
            required
            dir="rtl"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#F5DEB3',
                '& fieldset': {
                  borderColor: 'rgba(245, 222, 179, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(245, 222, 179, 0.5)',
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
          <TextField
            label="نبذة عن الفئة"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
            required
            dir="rtl"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#F5DEB3',
                '& fieldset': {
                  borderColor: 'rgba(245, 222, 179, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(245, 222, 179, 0.5)',
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
          <Box sx={{ textAlign: 'center' }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload">
              <Button
                component="span"
                variant="outlined"
                startIcon={<CloudUpload />}
                sx={{
                  mt: 1,
                  color: '#F5DEB3',
                  borderColor: 'rgba(245, 222, 179, 0.5)',
                  '&:hover': {
                    borderColor: '#F5DEB3',
                    backgroundColor: 'rgba(245, 222, 179, 0.1)',
                  },
                }}
              >
                إضافة صورة (اختياري)
              </Button>
            </label>
          </Box>
          {previewUrl && (
            <Box 
              sx={{ 
                textAlign: 'center', 
                mt: 2,
                p: 2,
                border: '1px dashed rgba(245, 222, 179, 0.3)',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.2)'
              }}
            >
              <img
                src={previewUrl}
                alt="Preview"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px',
                  borderRadius: '4px'
                }}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions 
        sx={{ 
          justifyContent: 'center', 
          gap: 2,
          padding: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{
            color: '#F5DEB3',
            borderColor: 'rgba(245, 222, 179, 0.5)',
            '&:hover': {
              borderColor: '#F5DEB3',
              backgroundColor: 'rgba(245, 222, 179, 0.1)',
            },
            minWidth: '120px'
          }}
        >
          إلغاء
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!name || !categoryName || !description}
          sx={{
            backgroundColor: 'rgba(245, 222, 179, 0.2)',
            color: '#F5DEB3',
            '&:hover': {
              backgroundColor: 'rgba(245, 222, 179, 0.3)',
            },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(245, 222, 179, 0.05)',
              color: 'rgba(245, 222, 179, 0.3)',
            },
            minWidth: '120px'
          }}
        >
          إرسال الاقتراح
        </Button>
      </DialogActions>
    </Dialog>
  );
};
