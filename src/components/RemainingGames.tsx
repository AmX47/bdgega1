import { useEffect, useState } from 'react';
import { getUserGameStats } from '../lib/gameSystem';
import {
  Box,
  Button,
  Text,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import { GameCodeModal } from './GameCodeModal';

interface RemainingGamesProps {
  count: number;
  onUpdate: () => void;
}

export default function RemainingGames() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const stats = await getUserGameStats();
      setRemaining(stats?.remaining_games ?? null);
    };

    fetchStats();
  }, []);

  if (remaining === null) return null;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleUpdate = () => {
    const fetchStats = async () => {
      const stats = await getUserGameStats();
      setRemaining(stats?.remaining_games ?? null);
    };

    fetchStats();
  };

  return (
    <Box>
      <HStack spacing={2} justify="center" align="center">
        <Text>الألعاب المتبقية:</Text>
        <Text fontWeight="bold">{remaining}</Text>
        <Button
          size="sm"
          colorScheme="red"
          onClick={onOpen}
        >
          +
        </Button>
      </HStack>

      <GameCodeModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={handleUpdate}
      />
    </Box>
  );
}
