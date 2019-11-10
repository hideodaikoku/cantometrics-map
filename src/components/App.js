// Dependencies
import React, { Component } from 'react';
import { render } from 'react-dom';
import MapGL from 'react-map-gl';
import { json as requestJson } from 'd3-request';

// Local Components, Data and CSS
import '../css/App.css'
import ControlPanel from './ControlPanel';
import { HeatMapStyle, CircleStyle } from './Heatmap-Style';
import mapdata from '../data/cantometrics.geojson';
// Constants
const MAPBOX_TOKEN = 'pk.eyJ1IjoiaGlkZW9kYWlrb2t1IiwiYSI6ImNqem8yaGt4bDBhbGozbWpzbmhxN2hkNWsifQ.348jAJoCqP13m2a52qywlA'; // Set your mapbox token here
const HEATMAP_SOURCE_ID = 'placy-source';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        longitude: 0,
        latitude: 23.5,
        zoom: 1.5,
        transitionDuration: 5000,
      },
      cities: {},
    };
    this._mapRef = React.createRef();
    this._handleMapLoaded = this._handleMapLoaded.bind(this);
    this._handleChange = this._handleChange.bind(this);

  }

  // bind features to a feature collection type object, called to set data
  _makeFeatureCollection = features => ({ type: 'FeatureCollection', features });

  // returns heatmap layer
  _makeHeatmapLayer = (id, aspect, source) => {
    const MAX_ZOOM_LEVEL = 15;
    return {
      id,
      source,
      maxzoom: MAX_ZOOM_LEVEL,
      type: 'heatmap',
      paint: HeatMapStyle(aspect)
    };
  };
  
  // returns a heatmap layer for circles when you zoom in beyond the max zoom level
  _makeHeatmapCircles = (id, type, aspect, source) => {
    const MIN_ZOOM_LEVEL = 13;
    return {
      id,
      type,
      source,
      minzoom: MIN_ZOOM_LEVEL,
      paint: CircleStyle(aspect)
    }
  }

  // handles dragging
  _onViewportChange = (viewport) => { 
    this.setState({ viewport });
  };

  // returns current map object  
  _getMap = () => {
    return this._mapRef.current ? this._mapRef.current.getMap() : null;
  };

  // when map loads, fire an event listener to get map, set state of cities add heatmap data and source
  _handleMapLoaded = () => {
    const map = this._getMap();
    requestJson(
      mapdata,
      (error, response) => {
        if (!error) {
          this.setState({
            cities: response,
          });
          map.addSource(HEATMAP_SOURCE_ID, { type: 'geojson', data: response });
          map.addLayer(this._makeHeatmapLayer('heatmap-layer', 'mag', HEATMAP_SOURCE_ID));
          map.addLayer(this._makeHeatmapCircles('circle-layer', 'circle', 'mag', HEATMAP_SOURCE_ID));
        }
      }
    );
  }

  // filter features based on selection {all day?}
  _filterFeaturesByName = (features, name) => {
    return features.filter(feature =>
      feature.properties[name]);
  };

  // handles change in option tag 
  _handleChange = (selected) => {
    this._getMap().removeLayer('heatmap-layer');
    this._getMap().removeLayer('circle-layer');
    this._getMap().addLayer(this._makeHeatmapLayer('heatmap-layer', selected, HEATMAP_SOURCE_ID));
    this._getMap().addLayer(this._makeHeatmapCircles('circle-layer', 'circle', selected, HEATMAP_SOURCE_ID));
    requestJson(
      mapdata,
      (error, response) => {
        if (!error) {
          if (response.features) {
            console.log(response)
            const features = this._filterFeaturesByName(response.features, selected);
            console.log(features);
            this._setMapData(features);
          }
        }
      }
    );
    
  };

  // sets map data for data source only if the state is set to the selected features
  _setMapData = features => {
    const map = this._getMap();
    if (map) {
      map.getSource(HEATMAP_SOURCE_ID).setData(this._makeFeatureCollection(features));
    }
  };

  // render method
  render() {
    const { viewport, evaluation } = this.state;

    return (
      <div style={{ height: '100%' }}>
        <MapGL
          ref={this._mapRef}
          {...viewport}
          width="100vw"
          height="100vh"
          mapStyle="mapbox://styles/hideodaikoku/cjzzx6mha19j11cuxdb2hpllv"
          onLoad={this._handleMapLoaded}
          onViewportChange={viewport => this._onViewportChange(viewport)}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        >
        </MapGL>
        <ControlPanel
          onChangeVal={this._handleChange}
          evaluation={evaluation}
        />
      </div>
    );
  }
}

export function renderToDom(container) {
  render(<App />, container);
}
