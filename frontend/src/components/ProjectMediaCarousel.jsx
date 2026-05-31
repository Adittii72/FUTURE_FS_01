import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { getMediaUrl } from '../utils/mediaUrl';

const ProjectMediaCarousel = ({ images, title }) => (
  <Carousel
    showThumbs={false}
    showStatus={false}
    infiniteLoop
    autoPlay
    interval={3500}
    useKeyboardArrows
    className="h-full"
  >
    {images.map((image) => (
      <div key={image.id} className="h-48">
        <img
          src={getMediaUrl(image.imageUrl)}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
    ))}
  </Carousel>
);

export default ProjectMediaCarousel;
