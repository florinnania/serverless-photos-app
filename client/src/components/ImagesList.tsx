import * as React from 'react'
import { ImageModel } from '../types/ImageModel'
import { getImages, deleteImage } from '../api/images-api'
import { getGroup } from '../api/groups-api'
import { Card, Divider, Button, Image, Icon } from 'semantic-ui-react'
import { UdagramImage } from './UdagramImage'
import { History } from 'history'
import Auth from '../auth/Auth'

interface ImagesListProps {
  history: History
  auth: Auth
  match: {
    params: {
      groupId: string
    }
  }
}

interface ImagesListState {
  images: ImageModel[]
  groupName: string
}

export class ImagesList extends React.PureComponent<
  ImagesListProps,
  ImagesListState
> {
  state: ImagesListState = {
    images: [],
    groupName: ''
  }

  handleCreateImage = () => {
    this.props.history.push(`/images/${this.props.match.params.groupId}/create`)
  }

  handleImageDelete = async (imageId: string) => {
    try {
      await deleteImage(imageId, this.props.auth.getIdToken())
      this.setState({
        images: this.state.images.filter(image => image.imageId !== imageId)
      })
    } catch {
      alert('Image deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const group = await getGroup(this.props.match.params.groupId, this.props.auth.getIdToken())
      const images = await getImages(this.props.match.params.groupId, this.props.auth.getIdToken())
      this.setState({
        images,
        groupName: group.name
      })
    } catch (e) {
      alert(`Failed to fetch images for group : ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <h1>{this.state.groupName}</h1>

        <Button
          primary
          size="big"
          className="add-button"
          onClick={this.handleCreateImage}
        >
          Upload new image
        </Button>

        <Divider clearing />

        <Card.Group itemsPerRow={3}>
          {this.state.images.map(image => {
            return (
              <Card fluid color="blue" key={image.imageId}>
                <Card.Content>
                  <Card.Header>{image.title}
                    <Button 
                      icon
                      color="red"
                      size="small"
                      onClick={() => this.handleImageDelete(image.imageId)}
                      floated="right"
                      >
                      <Icon name="delete"/>
                    </Button>
                  </Card.Header>
                  <Card.Description>{image.timestamp}</Card.Description>
                  {image.imageUrl && (
                    <Image src={image.imageUrl} />
                  )}
                </Card.Content>
              </Card>
            )       
          })}
        </Card.Group>
      </div>
    )
  }
}
