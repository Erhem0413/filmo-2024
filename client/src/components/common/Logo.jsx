import { Typography, useTheme } from '@mui/material';

const Logo = () => {
  const theme = useTheme();

  return (
    <Typography fontWeight="700" fontSize="1.7rem">
      Fil<span style={{ color: theme.palette.primary.main }}>Mo</span>
    </Typography>
  );
};

export default Logo;