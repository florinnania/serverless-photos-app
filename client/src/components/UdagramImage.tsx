import * as React from 'react'
import { Card, Image, Button, Icon } from 'semantic-ui-react'
import { ImageModel } from '../types/ImageModel'
import { deleteImage } from '../api/images-api'
import Auth from '../auth/Auth'

interface ImageCardProps {
  image: ImageModel
  auth: Auth
}

interface ImageCardState {
  images: ImageModel[]
  groupName: string
}

export class UdagramImage extends React.PureComponent<
  ImageCardProps,
  ImageCardState
> {

  onImageDelete = async (imageId: string) => {
    try {
      await deleteImage(imageId, this.props.auth.getIdToken())
      this.setState({
        images: this.state.images.filter(image => image.imageId !== imageId)
      })
    } catch {
      alert('Image deletion failed')
    }
  }

  render() {
    return (
      <Card fluid color="blue">
        <Card.Content>
          <Card.Header>{this.props.image.title}
            <Button
                icon
                color="red"
                size="small"
                onClick={() => this.onImageDelete(this.props.image.imageId)}
                floated="right"
              >
              <Icon name="delete" />
            </Button>
          </Card.Header>
          <Card.Description>{this.props.image.timestamp}</Card.Description>
          {this.props.image.imageUrl && (
            <Image src={this.props.image.imageUrl} />
          )}
        </Card.Content>
      </Card>
    )
  }
}
