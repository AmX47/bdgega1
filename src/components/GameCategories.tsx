import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { getGameCategories, getNewRandomQuestion } from '../utils/gameUtils';

interface GameCategoriesProps {
  onSelectCategory: (categoryId: number, question: any) => void;
}

const GameCategories: React.FC<GameCategoriesProps> = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Get initial random categories
    const initialCategories = getGameCategories();
    setCategories(initialCategories);
  }, []);

  const handleCategoryClick = (categoryId: number, pointLevel: number) => {
    const question = getNewRandomQuestion(categoryId, pointLevel);
    if (question) {
      onSelectCategory(categoryId, question);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 6,
                  }
                }}
                onClick={() => {
                  // Get the first question's point level for this category
                  const pointLevel = category.questions[0]?.points || 300;
                  handleCategoryClick(category.id, pointLevel);
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={category.image}
                  alt={category.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" align="center">
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {category.description}
                  </Typography>
                  <Typography variant="h6" color="primary" align="center" sx={{ mt: 2 }}>
                    {category.questions[0]?.points || 300} نقطة
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GameCategories;
