import PropTypes from 'prop-types';
// material
import { Paper, Typography,Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  return (
    <Paper {...other}>
         <Box sx={{ display: 'flex',marginLeft:'60%'}} >
            <CircularProgress />
          </Box>
    </Paper>
  );
}
