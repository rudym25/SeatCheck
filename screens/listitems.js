import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import HomeIcon from '@material-ui/icons/Home';
import EditIcon from '@material-ui/icons/Edit';
import GridOnIcon from '@material-ui/icons/GridOn';
import MapIcon from '@material-ui/icons/Map';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";


export const mainListItems = (
  <div>
    <ListItem button component="a" href="/">
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary="Home Page" />
    </ListItem>
    <ListItem button component="a" href="/create">
      <ListItemIcon>
        <EditIcon />
      </ListItemIcon>
      <ListItemText primary="Create Map" />
    </ListItem>
    <ListItem button component="a" href="/view">
      <ListItemIcon>
        <GridOnIcon />
      </ListItemIcon>
      <ListItemText primary="View Map" />
    </ListItem>
    
    <ListItem button component="a" href="/maps">
      <ListItemIcon>
        <MapIcon />
      </ListItemIcon>
      <ListItemText primary="My Maps" />
    </ListItem>

  </div>
);
