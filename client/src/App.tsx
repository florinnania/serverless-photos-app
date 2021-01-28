import React, { Component } from 'react'
import { GroupsList } from './components/GroupsList'
import { Router, Link, Route, Switch } from 'react-router-dom'
import { Button, Grid, Header, Menu, Segment } from 'semantic-ui-react'
import { ImagesList } from './components/ImagesList'
import { NotFound } from './components/NotFound'
import { CreateImage } from './components/CreateImage'
import { CreateGroup } from './components/CreateGroup'
import Auth from './auth/Auth'

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu>
        <Menu.Item name="my albums">
          <Link to="/">My Albums</Link>
        </Menu.Item>

        <Menu.Menu position="right">{this.logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return (
        <div>
          <Segment style={{ padding: '18em 0em' }} vertical>
            <Header as='h1' textAlign='center'>Welcome to the home of your memories</Header>
            <Grid>
              <Grid.Column textAlign="center">
                <Button
                    primary
                    size="huge"
                    className="add-button"
                    onClick={this.handleLogin}
                  >
                    Go to photo albums
                </Button>
              </Grid.Column>
            </Grid>
            
          </Segment>
        </div>
      )
    }
    return (
      <div>

        {this.generateMenu()}

        <Switch>
          <Route
            path="/groups/create"
            exact
            render={props => {
              return <CreateGroup {...props} auth={this.props.auth} />
            }}
          />

          <Route path="/images/:groupId" 
            exact 
            render={props => {
              return <ImagesList {...props} auth={this.props.auth} />
            }} 
          />
        
          <Route
            path="/images/:groupId/create"
            exact
            render={props => {
              return <CreateImage {...props} auth={this.props.auth} />
            }}
          />

          <Route path="/" exact           
            render={props => {
              return <GroupsList {...props} auth={this.props.auth} />
            }} />

          <Route component={NotFound} />
        </Switch>
      </div>
    )
  }
}
