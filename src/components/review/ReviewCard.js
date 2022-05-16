import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import { Link as RouterLink } from "react-router-dom";
import shareFill from "@iconify/icons-eva/share-fill";
import starFill from "@iconify/icons-eva/star-fill";
import StarIcon from '@mui/icons-material/Star';

import messageCircleFill from "@iconify/icons-eva/message-circle-fill";
// material
import { alpha, styled } from "@mui/material/styles";
import {
  Box,
  Link,
  Card,
  Grid,
  Avatar,
  Typography,
  CardContent,
} from "@mui/material";
// utils
import { useEffect } from "react";
import { fDate } from "../../utils/formatTime";
import { fShortenNumber } from "../../utils/formatNumber";
//

import SvgIconStyle from "../SvgIconStyle";
import callApi from "src/api/apiService";

// ----------------------------------------------------------------------

const CardMediaStyle = styled("div")({
  position: "relative",
  paddingTop: "calc(100% * 3 / 4)",
});

const TitleStyle = styled(Link)({
  height: 44,
  overflow: "hidden",
  WebkitLineClamp: 2,
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
});

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: "absolute",
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const InfoStyle = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-end",
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));

const CoverImgStyle = styled("img")({
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute",
});

// ----------------------------------------------------------------------
ReviewCard.propTypes = {
  review: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function ReviewCard({ review, index }) {
  const { avatarUser,comment,createAt,imagesReview,nameUser,star } = review;
  const latestreviewLarge = index === 0;
  const latestreview = index === 1 || index === 2;
 


  return (
    <>
      <Grid
        item
        xs={ 6}
        sm={6}
        md={ 3}
      >
        <Card sx={{ position: "relative" }}>
          <CardMediaStyle
            sx={{
             
                pt: "calc(100% * 4 / 3)",
                "&:after": {
                  top: 0,
                  content: "''",
                  width: "100%",
                  height: "100%",
                  position: "absolute",
               
                },
             
          
            }}
          >
            <SvgIconStyle
              color="paper"
              src="/static/icons/shape-avatar.svg"
              sx={{
                width: 80,
                height: 36,
                zIndex: 9,
                bottom: -15,
                position: "absolute",
                color: 'background.paper',
                display: 'none' 
              }}
            />
            <AvatarStyle
              src={avatarUser}
              sx={{  zIndex: 9,
               
                width: 40,
                height: 40,}}
           
            />

            <CoverImgStyle alt={comment} src={imagesReview[0]} />
          </CardMediaStyle>

          <CardContent
           
          >
            <Typography
              gutterBottom
              variant="caption"
              sx={{ color: "text.disabled", display: "block" }}
            >
              {nameUser}
            </Typography>

            <TitleStyle
              to="#"
              color="inherit"
              variant="subtitle2"
              underline="hover"
      
            
            >
              {comment}
            </TitleStyle>

            <InfoStyle>
           
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    ml: index === 0 ? 0 : 1.5,
                    ...((latestreviewLarge || latestreview) && {
                      color: "grey.500",
                    }),
                  }}
                >
                  <Box
                    component={Icon}
                    icon={Icon.eyeFill}
                    sx={{ width: 16, height: 16, mr: 0.5 }}
                  />
                  <Typography variant="caption">
                    {star}
                   
                   
                  </Typography>
                  <StarIcon style={{marginTop:"-3px",color:"#fed813"}}/>
                </Box>
          
            </InfoStyle>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}
