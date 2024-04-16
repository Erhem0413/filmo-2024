import { LoadingButton } from "@mui/lab";
import { Box, Stack, Typography, Chip } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import tmdbConfigs from "../api/configs/tmdb.configs";
import mediaApi from "../api/modules/media.api";
import uiConfigs from "../configs/ui.configs";
import MediaGrid from "../components/common/MediaGrid";
import { setAppState } from "../redux/features/appStateSlice";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import { toast } from "react-toastify";
import usePrevious from "../hooks/usePrevious";
import genreApi from "../api/modules/genre.api";
const MediaList = () => {
  const { mediaType } = useParams();

  const [medias, setMedias] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [currCategory, setCurrCategory] = useState(0);
  const [currPage, setCurrPage] = useState(1);

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const prevMediaType = usePrevious(mediaType);
  const dispatch = useDispatch();
  const mediaCategories = useMemo(() => ["popular", "top_rated"], []);

  useEffect(() => {
    dispatch(setAppState(mediaType));
    window.scrollTo(0, 0);
  
    const getGenresAndDisplayAction = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await genreApi.getList({ mediaType });
  
      if (response) {
        setGenres(response.genres);
        console.log("Genres:", response.genres);
        onGenreChange();
      }
      if (err) {
        toast.error(err.message);
        setGlobalLoading(false);
      }
    };
    getGenresAndDisplayAction();
  }, [mediaType, dispatch]);
  

  useEffect(() => {
    const getMedias = async () => {
      if (currPage === 1) dispatch(setGlobalLoading(true));
      setMediaLoading(true);

      const { response, err } = await mediaApi.getList({
        mediaType,
        mediaCategory: mediaCategories[currCategory],
        page: currPage,
        genre: selectedGenre,
      });

      setMediaLoading(false);
      dispatch(setGlobalLoading(false));

      if (err) toast.error(err.message);
      if (response) {
        if (currPage !== 1) setMedias(m => [...m, ...response.results]);
        else setMedias([...response.results]);
      }
    };

    if (mediaType !== prevMediaType) {
      setCurrCategory(0);
      setCurrPage(1);
    }

    getMedias();

    const getGenres = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await genreApi.getList({ mediaType });

      if (response) {
        setGenres(response.genres);
        console.log("Genres:", response.genres);
        getMedias();
      }
      if (err) {
        toast.error(err.message);
        setGlobalLoading(false);
      }
    };
    
    getGenres();
  }, [
    mediaType,
    currCategory,
    prevMediaType,
    currPage,
    mediaCategories,
    dispatch,
    selectedGenre
  ]);
  // const onCategoryChange = (categoryIndex) => {
  //   if (currCategory === categoryIndex) return;
  //   setMedias([]);
  //   setCurrPage(1);
  //   setCurrCategory(categoryIndex);
  // };
  console.log("MEDIAS",medias);

  const onLoadMore = () => setCurrPage(currPage + 1);

  const onGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    setMedias([]);
    setCurrPage(1);
  };
  

  return (
    <>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, p: 1,mx: 10 , mt:10}}>
        {genres.map((genre) => (
          <Chip
            key={genre.id}
            label={genre.name}
            clickable
            color={selectedGenre === genre.id ? "primary" : "default"}
            onClick={() => onGenreChange(genre.id)}
          />
        ))}
      </Box>
      <Box sx={{ ...uiConfigs.style.mainContent }}>
        <Stack
          spacing={2}
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          sx={{ marginBottom: 4 }}
        >
          <Typography fontWeight="700" variant="h5">
            {mediaType === tmdbConfigs.mediaType.movie ? "Кино" : "Олон ангит"}
          </Typography>
        </Stack>
        <MediaGrid
          medias={medias.filter(media => 
          selectedGenre ? media.genre_ids.includes(selectedGenre) : true
        )}
          mediaType={mediaType}
        />
        <LoadingButton
          sx={{ marginTop: 8 }}
          fullWidth
          color="primary"
          loading={mediaLoading}
          onClick={onLoadMore}
        >
          Ачааллах
        </LoadingButton>
      </Box>
    </>
  );
};

export default MediaList;