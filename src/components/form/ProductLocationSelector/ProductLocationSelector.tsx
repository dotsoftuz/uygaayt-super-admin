import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { ProductLocationSelectorStyled } from './ProductLocationSelector.style';

export interface Section {
  id: string;
  name: string;
  rect: {
    x_percent: string;
    y_percent: string;
    width_percent: string;
    height_percent: string;
  };
}

export interface SelectedLocation {
  section_id: string;
  section_name: string;
  rect: Section['rect'];
}

interface ProductLocationSelectorProps {
  sections: Section[];
  mapImageUrl?: string;
  onLocationSelect: (location: SelectedLocation | null) => void;
  selectedLocation?: SelectedLocation | null;
  imageSize?: {
    width: number;
    height: number;
  };
}

const ProductLocationSelector: React.FC<ProductLocationSelectorProps> = ({
  sections,
  mapImageUrl,
  onLocationSelect,
  selectedLocation,
  imageSize = { width: 837, height: 634 },
}) => {
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: imageSize.width, height: imageSize.height });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateImageDimensions = useCallback(() => {
    if (mapImageUrl && imageRef.current) {
      setImageDimensions({
        width: imageRef.current.offsetWidth,
        height: imageRef.current.offsetHeight,
      });
    } else {
      const containerWidth = containerRef.current?.offsetWidth || imageSize.width;
      const aspectRatio = imageSize.height / imageSize.width;
      const calculatedHeight = containerWidth * aspectRatio;
      setImageDimensions({
        width: containerWidth,
        height: Math.max(calculatedHeight, 400),
      });
    }
  }, [mapImageUrl, imageSize]);

  useEffect(() => {
    updateImageDimensions();
    window.addEventListener('resize', updateImageDimensions);
    return () => window.removeEventListener('resize', updateImageDimensions);
  }, [updateImageDimensions]);

  useEffect(() => {
    if (mapImageUrl && imageRef.current?.complete) {
      updateImageDimensions();
    } else {
      updateImageDimensions();
    }
  }, [mapImageUrl, updateImageDimensions]);

  const handleSectionClick = (section: Section) => {
    if (selectedLocation?.section_id === section.id) {
      onLocationSelect(null);
    } else {
      onLocationSelect({
        section_id: section.id,
        section_name: section.name,
        rect: section.rect,
      });
    }
  };

  const calculateRectPosition = (section: Section) => {
    const svgWidth = imageSize.width;
    const svgHeight = imageSize.height;

    const x = (parseFloat(section.rect.x_percent) / 100) * svgWidth;
    const y = (parseFloat(section.rect.y_percent) / 100) * svgHeight;
    const width = (parseFloat(section.rect.width_percent) / 100) * svgWidth;
    const height = (parseFloat(section.rect.height_percent) / 100) * svgHeight;

    return { x, y, width, height };
  };

  const isSelected = (sectionId: string) => {
    return selectedLocation?.section_id === sectionId;
  };

  const isHovered = (sectionId: string) => {
    return hoveredSectionId === sectionId;
  };

  const aspectRatio = imageSize.height / imageSize.width;

  return (
    <ProductLocationSelectorStyled ref={containerRef}>
      <Box 
        className="map-container"
        style={{
          aspectRatio: `${imageSize.width} / ${imageSize.height}`,
          height: mapImageUrl ? 'auto' : undefined,
        }}
      >
        {mapImageUrl && (
          <img
            ref={imageRef}
            src={mapImageUrl}
            alt="Store map"
            onLoad={updateImageDimensions}
            className="map-image"
            style={{
              display: 'block',
            }}
          />
        )}
        <svg
          className="map-overlay"
          width="100%"
          height="100%"
          viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: mapImageUrl ? 'absolute' : 'relative',
            top: 0,
            left: 0,
            pointerEvents: 'all',
            backgroundColor: mapImageUrl ? 'transparent' : '#f5f5f5',
            display: 'block',
          }}
        >
          {sections.map((section) => {
            const { x, y, width, height } = calculateRectPosition(section);
            const selected = isSelected(section.id);
            const hovered = isHovered(section.id);

            return (
              <g key={section.id}>
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={
                    selected
                      ? 'rgba(76, 175, 80, 0.5)'
                      : hovered
                      ? 'rgba(33, 150, 243, 0.4)'
                      : 'rgba(255, 255, 255, 0.1)'
                  }
                  stroke={
                    selected
                      ? '#4CAF50'
                      : hovered
                      ? '#2196F3'
                      : '#666'
                  }
                  strokeWidth={selected ? 3 : hovered ? 2 : 1}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => handleSectionClick(section)}
                  onMouseEnter={() => setHoveredSectionId(section.id)}
                  onMouseLeave={() => setHoveredSectionId(null)}
                />
                <text
                  x={x + width / 2}
                  y={y + height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={selected ? "#fff" : hovered ? "#fff" : "#333"}
                  fontSize="11"
                  fontWeight={selected ? "bold" : "normal"}
                  pointerEvents="none"
                  style={{
                    textShadow: selected || hovered ? '1px 1px 2px rgba(0,0,0,0.8)' : '1px 1px 1px rgba(255,255,255,0.8)',
                  }}
                >
                  {section.name}
                </text>
              </g>
            );
          })}
        </svg>
      </Box>
      {selectedLocation && (
        <Box className="selected-info">
          <Typography variant="body2" className="selected-label">
            Tanlangan bo'lim:
          </Typography>
          <Typography variant="body1" className="selected-name">
            {selectedLocation.section_name}
          </Typography>
        </Box>
      )}
    </ProductLocationSelectorStyled>
  );
};

export default ProductLocationSelector;

