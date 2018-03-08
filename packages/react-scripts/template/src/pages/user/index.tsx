import { BaseComponent } from 'components/base';
import * as React from 'react';

export default class UserIndexPage extends BaseComponent {
  render() {
    return (
      <div>{this.props.children}</div>
    );
  }
}
