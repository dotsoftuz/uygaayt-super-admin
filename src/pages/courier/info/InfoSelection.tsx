import { Box, Typography } from '@mui/material';

interface InfoSectionProps {
  data: Record<string, string | number>;
}

export const InfoSection = ({ data }: InfoSectionProps) => (
  <Box>
    {Object.entries(data).map(([key, value]) => (
      <Box 
        key={key} 
        sx={{ 
          mb: 2.5,
          '&:last-child': { mb: 0 }
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 0.5, 
            color: '#64748b',
            fontSize: '0.875rem'
          }}
        >
          {key}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{
            fontWeight: 500,
            color: '#334155',
            fontSize: '1rem'
          }}
        >
          {value || '—'}
        </Typography>
      </Box>
    ))}
  </Box>
);