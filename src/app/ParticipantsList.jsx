import React from 'react';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import Ee from 'event-emitter';
import MediaQuery from 'react-responsive';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridListDesktop: {
    width: 400,
    height: "100%",
    overflowY: 'auto',
    marginBottom: 24,
  },
  gridListTabletPortrait: {
    width: 768,
    height: "100%",
    overflowY: 'auto',
    marginBottom: 24,
  },
  gridListTabletLandscape: {
    width: 1024,
    height: "100%",
    overflowY: 'auto',
    marginBottom: 24,
  },
};

const tilesData = [];


const ParticipantsList = React.createClass({
  getInitialState : function() {
    return {participants:tilesData.length};
  },
  componentDidMount : function() {
    Ee.methods.on('test',this.updateListener);
  },
  updateListener : function(args) {
    tilesData.push({
      img:args.webPath,
      name:args.name,
      surname:args.surname,
    });
    this.setState({participants:tilesData.length});
  },
  render : function() {
    return (
      <div style={styles.root}>
        <MediaQuery query="(min-device-width: 1224px)">
          <GridList
            cols={2}
            cellHeight={200}
            style={styles.gridListDesktop}
          >
        {tilesData.map((tile) => (
          <GridTile
            key={tile.img}
            title={tile.name}
            subtitle={tile.surname}
          >
            <img src={tile.img} />
          < /GridTile>
          ))}
          < /GridList>
        < /MediaQuery>
        <MediaQuery query="(max-device-width: 1224px)">
          <MediaQuery query="(orientation: portrait)">
            <GridList
              cols={4}
              cellHeight={200}
              style={styles.gridListTabletPortrait}
            >
          {tilesData.map((tile) => (
            <GridTile
              key={tile.img}
              title={tile.name}
              subtitle={tile.surname}
            >
              <img src={tile.img} />
            < /GridTile>
            ))}
            < /GridList>
          < /MediaQuery>
          <MediaQuery query="(orientation: landscape)">
            <GridList
              cols={4}
              cellHeight={200}
              style={styles.gridListTabletLandscape}
            >
          {tilesData.map((tile) => (
            <GridTile
              key={tile.img}
              title={tile.name}
              subtitle={tile.surname}
            >
              <img src={tile.img} />
            < /GridTile>
            ))}
            < /GridList>
          < /MediaQuery>
        < /MediaQuery>
      < /div>
      );
  },
});

export default ParticipantsList;
