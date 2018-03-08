import { BaseComponent, IStateBase } from 'components/base';
import { WithStyles } from 'decorators/withStyles';
import { Fade } from 'material-ui';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import * as React from 'react';

interface IState extends IStateBase {
  refs: string[];
  hide: boolean;
}

@WithStyles({
  root: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'rgba(0,0,0,.5)',
    zIndex: 1500,
    textAlign: 'center',
    lineHeight: '100vh'
  },
  hidden: {
    display: 'none'
  }
})
export default class LoaderComponent extends BaseComponent<IState> {
  constructor(props: any) {
    super(props);
    this.state = { refs: [], hide: false };
  }

  componentDidMount() {
    this.hide();
  }

  public show(ref: string): void {
    if (typeof ref !== 'string') {
      throw new Error('Loader.show needs a ref string value');
    }

    const { refs } = this.state;
    if (refs.some(r => r === ref)) return;

    refs.push(ref);
    this.setState({ refs, hide: false });
  }

  public hide(ref?: string): void {
    if (ref && typeof ref !== 'string') {
      throw new Error('Loader.hide needs a ref string value');
    }

    setTimeout(() => {
      if (refs.length) return;
      this.setState({ hide: true });
    }, 500);

    const { refs } = this.state;
    const index = refs.indexOf(ref);
    if (index === -1) return;

    refs.splice(index, 1);
    this.setState({ refs });
  }

  render() {
    const { refs, hide } = this.state;
    const { classes } = this.props;

    return (
      <div className={hide ? classes.hidden : ''}>
        <Fade in={!!refs.length}>
          <div className={classes.root}>
            <CircularProgress size={80} />
          </div>
        </Fade>
      </div>
    );
  }

}