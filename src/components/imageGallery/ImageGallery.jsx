import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getImages } from 'services/finder-api';
import { ImageGalleryItem } from 'components/imageGalleryItem/ImageGalleryItem';
import { Button } from 'components/button/Button';
import { Loader } from 'components/loader/Loader';
import { ImageGalleryStyled } from 'components/imageGallery/ImageGallery.styled';
// import { getRoles } from '@testing-library/react';

export const ImageGallery = ({
  selectBigUrl,
  showModal,
  onClick,
  searchParam,
  page,
}) => {
  const [images, setImages] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!searchParam) {
      return;
    }
    setVisible(true);

    try {
      if (page === 1) {
        getImages(searchParam, page).then(images =>
          setImages([...images.hits])
        );
      } else {
        getImages(searchParam, page).then(images =>
          setImages(state => [...state, ...images.hits])
        );
      }
    } catch (error) {
      console.log(error);
    }
    setVisible(false);
  }, [searchParam, page]);

  const openModal = e => {
    selectBigUrl(e.target.id);
    showModal();
  };

  return (
    <>
      <ImageGalleryStyled onClick={openModal}>
        {visible && <Loader />}
        {images.map(({ id, webformatURL, largeImageURL, tags }) => {
          return (
            <ImageGalleryItem
              key={id}
              smallUrl={webformatURL}
              bigUrl={largeImageURL}
              alt={tags}
            ></ImageGalleryItem>
          );
        })}
      </ImageGalleryStyled>
      {images.length > 0 && <Button type="button" onClick={onClick}></Button>}
    </>
  );
};

// export class ImageGallery extends Component {
//   state = {
//     images: [],
//     visible: false,
//   };

//   componentDidUpdate = async (prevProps, prevState) => {
//     const prevSearch = prevProps.searchParam;
//     const nextSearch = this.props.searchParam;
//     const prevPage = prevProps.page;
//     const nextPage = this.props.page;

//     if (prevSearch !== nextSearch || prevPage !== nextPage) {
//       this.setState({ visible: true });
// try {
//   const images = await getImages(nextSearch, nextPage);

//   if (nextPage === 1) {
//     this.setState({ images: images.hits });
//   } else {
//     this.setState(prevProps => ({
//       images: [...prevProps.images, ...images.hits],
//     }));
//   }
// } catch (error) {
//   console.log(error);
// }

//       this.setState({ visible: false });
//     }
//   };

// openModal = e => {
//   this.props.selectBigUrl(e.target.id);
//   this.props.showModal();
// };

//   render() {
//     const { visible, images } = this.state;
//     const { onClick } = this.props;

//     return (
// <>
//   <ImageGalleryStyled onClick={this.openModal}>
//     {visible && <Loader />}
//     {images.map(({ id, webformatURL, largeImageURL, tags }) => {
//       return (
//         <ImageGalleryItem
//           key={id}
//           smallUrl={webformatURL}
//           bigUrl={largeImageURL}
//           alt={tags}
//         ></ImageGalleryItem>
//       );
//     })}
//   </ImageGalleryStyled>
//   {images.length > 0 && <Button type="button" onClick={onClick}></Button>}
// </>
//     );
//   }
// }

ImageGallery.propTypes = {
  searchParam: PropTypes.string.isRequired,
  page: PropTypes.number,
  selectBigUrl: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  showModal: PropTypes.func,
};
