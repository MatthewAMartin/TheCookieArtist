import React, { useState, useEffect, useCallback } from "react";
import { DotButton, PrevButton, NextButton } from "./EmblaCarouselButtons";
import useEmblaCarousel from "embla-carousel-react";
import { Popup } from "semantic-ui-react";

const EmblaCarousel = ({ urls, deleteImage, pageState }) => {
  // Carousel Variables
  const [viewportRef, embla] = useEmblaCarousel({ skipSnaps: false });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [canDelete, setCanDelete] = useState(true);

  // Delete Popup Variables
  const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);

  // Carousel Controls
  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
  const scrollTo = useCallback(
    (index) => embla && embla.scrollTo(index),
    [embla]
  );
  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla, setSelectedIndex]);

  useEffect(() => {
    // User can't delete when on Delete form
    if (pageState === "Delete") {
      setCanDelete(false);
    } else {
      setCanDelete(true);
    }

    // Initialise Carousel
    if (!embla) return;
    embla.reInit();
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on("select", onSelect);
  }, [embla, setScrollSnaps, onSelect, urls, deleteImage, pageState]);

  /**
   * deleteCurrent handles deletion of an image from the carousel.
   * Deletes the image from the approporiate storage array in the
   * parent component.
   *
   */
  const deleteCurrent = () => {
    deleteImage(selectedIndex); // Delete the Image
    setIsDeleteConfirmation(false); // Close the delete confirmation Popup
  };

  return (
    <>
      <div className="embla">
        <div className="embla__viewport" ref={viewportRef}>
          <div className="embla__container">
            {urls.map((_, index) => (
              <div className="embla__slide" key={index}>
                <div className="embla__slide__inner">
                  <img
                    className="embla__slide__img"
                    src={urls[index]}
                    style={{ width: 100 + "%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
        <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
        {canDelete && (
          <Popup
            on="click"
            open={isDeleteConfirmation}
            onClose={() => {
              setIsDeleteConfirmation(false);
            }}
            hideOnScroll
            position="left center"
            trigger={
              <button
                type="button"
                className={"btn btn-danger btn-block embla_delete"}
                onClick={() => {
                  setIsDeleteConfirmation(true);
                }}
              >
                <img src="/icons/x.svg" />
              </button>
            }
          >
            <h5>Confirm Deletion</h5>
            <p>Are you sure you want to delete this image?</p>
            <button
              type="button"
              className={"btn btn-danger btn-block"}
              style={{ marginRight: 10 + "px" }}
              onClick={() => {
                setIsDeleteConfirmation(false);
                deleteCurrent();
              }}
            >
              Delete
            </button>
            <button
              type="button"
              className={"btn btn-secondary btn-block"}
              onClick={() => {
                setIsDeleteConfirmation(false);
              }}
            >
              Cancel
            </button>
          </Popup>
        )}
      </div>
      <div className="embla__dots">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            selected={index === selectedIndex}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </>
  );
};

export default EmblaCarousel;
