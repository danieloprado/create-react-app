import { BaseComponent } from 'components/base';
import AppDrawerUser from 'components/drawerUser';
import { WithStyles } from 'decorators/withStyles';
import { List, ListItem, ListItemIcon, ListItemText, Typography } from 'material-ui';
import { Dashboard } from 'material-ui-icons';
import { darken } from 'material-ui/styles/colorManipulator';
import React from 'react';

@WithStyles(theme => ({
  root: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    height: '100vh'
  },
  header: {
    padding: '10px 0',
    textAlign: 'center',
    background: darken(theme.palette.primary.main, 0.15)
  },
  logo: {
    maxWidth: '100px',
    maxHeight: '100px'
  },
  icon: {
    margin: '0'
  },
  text: {
    color: 'inherit'
  }
}))
export default class AppDrawer extends BaseComponent {

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <img src={require('assets/logo.png')} className={classes.logo} />
          <Typography variant='subheading' color='inherit'>
            Your App
          </Typography>

          <AppDrawerUser />
        </div>

        <List>
          <ListItem button>
            <ListItemIcon className={classes.icon} classes={{ root: classes.text }}>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary='Dashboard' classes={{ primary: classes.text }} />
          </ListItem>
        </List>
      </div>
    );
  }
}