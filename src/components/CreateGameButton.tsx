import React from 'react';
import {
  Button,
  useToast,
} from '@chakra-ui/react';
import { canCreateGame } from '../lib/gameSystem';

interface CreateGameButtonProps {
  onCreateGame: () => void;
  remainingGames: number;
}

export function CreateGameButton({ onCreateGame, remainingGames }: CreateGameButtonProps) {
  const toast = useToast();

  const handleClick = async () => {
    if (remainingGames === 0) {
      toast({
        title: 'ليس لديك ألعاب كافية',
        description: 'الرجاء إضافة كود لعبة جديد للمتابعة',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    const canCreate = await canCreateGame();
    if (canCreate) {
      onCreateGame();
    } else {
      toast({
        title: 'خطأ',
        description: 'لا يمكن إنشاء لعبة جديدة',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <Button
      colorScheme="blue"
      onClick={handleClick}
      isDisabled={remainingGames === 0}
    >
      إنشاء لعبة
    </Button>
  );
}
