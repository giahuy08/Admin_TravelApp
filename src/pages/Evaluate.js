import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link, Navigate } from "react-router-dom";

// material
import {
  Grid,
  Button,
  Container,
  Stack,
  Typography,
  Paper,Box,
  Card,
  Avatar,
} from "@mui/material";
// components
import Page from "../components/Page";
import {
  BlogPostCard,
  BlogPostsSort,
  BlogPostsSearch,
} from "../components/_dashboard/blog";
//
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";

import PropTypes from "prop-types";
import POSTS from "../_mocks_/blog";
import ReviewCard from "src/components/review/ReviewCard";
import callApi from "src/api/apiService";
import { useParams, useNavigate } from "react-router-dom";
import { alpha, styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
// ----------------------------------------------------------------------
import SvgIconStyle from "../components/SvgIconStyle";
const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "oldest", label: "Oldest" },
];

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
export default function Evaluate() {
  const { idTour } = useParams();
  console.log(idTour);
  const [tour, setTour] = useState();
  const [nameTour, setNameTour] = useState("");
  const [reviews, setReviews] = useState([]);
  const historyback = useNavigate();
  useEffect(() => {
    callApi(`reviewtour/getReviewOfTour?idTour=${idTour}`).then((res) => {
      setReviews(res.data.data);
    });
  }, []);

  useEffect(() => {
    callApi(`tour/getOneTour?id=${idTour}`).then((res) => {
      setTour(res.data.data);
      setNameTour(res.data.data.name);
    });
  }, []);
  return (
    <Page title="Travel App">
      <Container>
        <span
          onClick={() => {
            historyback("/dashboard/tour");
          }}
          style={{
            display: "block",
            textDecoration: "none",
            color: "#98a0a5",
            cursor: "pointer",
            width: 150,
            height: 60,
          }}
        >
          <ArrowBackIos style={{ fontSize: "20px", marginBottom: "-3px" }} />
          Quay lại
        </span>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            {nameTour}
          </Typography>
        </Stack>

        <Card sx={{ position: "relative", marginBottom: 5 }}>
          <CardMediaStyle>
            <SvgIconStyle
              color="paper"
              // src="/static/icons/shape-avatar.svg"
            />

            {tour!=null && (
              <CoverImgStyle src={tour.imagesTour[0]} />
            )}
          </CardMediaStyle>
        </Card>

        <Grid container spacing={3}>
          {reviews &&
            reviews.map((review, index) => (
              <ReviewCard
                key={review.id}
                review={review}
                index={index}
                id={review.id}
              />
            ))}
        </Grid>
      </Container>
    </Page>
  );
}
