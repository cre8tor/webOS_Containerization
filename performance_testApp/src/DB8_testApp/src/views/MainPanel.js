import Button from '@enact/moonstone/Button';
//import kind from '@enact/core/kind';
import handle from '@enact/core/handle';
import {Panel, Header} from '@enact/moonstone/Panels';
import LS2Request from '@enact/webos/LS2Request';
import React from 'react';
import ProgressBar from '@enact/moonstone/ProgressBar';
import BodyText from '@enact/moonstone/BodyText';

/*const handler = handle(
  // eslint-disable-next-line
  (ev, props) => {
    new LS2Request().send({
      service: 'luna://com.webos.service.db/',
      method: 'putKind',
      parameters: {
        id: 'com.domain.app:1',
        owner: 'com.domain.app',
        indexes: [{name: 'sample', props: [{name: 'sample'}]}]
      }
    });
    let start = new Date().getTime();

    for(let i=0; i<1000; i++) {
      new LS2Request().send({
        service: 'luna://com.webos.service.db/',
        method: 'put',
        parameters: {
          objects: [
            {
              "_kind": 'com.domain.app:1',
              sample: 'sample'+i,
            }
          ]
        }
      });
      this.setState({putProgress: i});
    }

    let elapsed = new Date().getTime() - start;
    console.warn("l5vd5 put : " + elapsed);
    let start2 = new Date().getTime();

    for(let i=0; i<1000; i++) {
      new LS2Request().send({
        service: 'luna://com.webos.service.db/',
        method: 'find',
        parameters: {
          query: {
            from: 'com.domain.app:1',
            where: [
              {
                prop: 'sample',
                op: '=',
                val: 'sample'+i,
              }
            ]
          }
        }
      });
    }

    let elapsed2 = new Date().getTime() - start2;
    console.warn("l5vd5 find  : " + elapsed2);
  }
);*/

export default class MainPanel extends React.Component {
  constructor (props) {
		super(props);

    this.state = {
      putProgress: 0,
      findProgress: 0
    }

    this.handler.bind(this);
	}
  handler= () => {
    new LS2Request().send({
      service: 'luna://com.webos.service.db/',
      method: 'putKind',
      parameters: {
        id: 'com.domain.app:1',
        owner: 'com.domain.app',
        indexes: [{name: 'sample', props: [{name: 'sample'}]}]
      }
    });
    let start = new Date().getTime();

    for(let i=0; i<10000; i++) {
      new LS2Request().send({
        service: 'luna://com.webos.service.db/',
        method: 'put',
        parameters: {
          objects: [
            {
              "_kind": 'com.domain.app:1',
              sample: 'sample'+i,
            }
          ]
        }
      });
      this.setState({putProgress: i});
    }

    let elapsed = new Date().getTime() - start;
    console.warn("l5vd5 put : " + elapsed);
    this.setState({putElapsed: elapsed});

    let start2 = new Date().getTime();

    for(let i=0; i<10000; i++) {
      new LS2Request().send({
        service: 'luna://com.webos.service.db/',
        method: 'find',
        parameters: {
          query: {
            from: 'com.domain.app:1',
            where: [
              {
                prop: 'sample',
                op: '=',
                val: 'sample'+i,
              }
            ]
          }
        }
      });
      this.setState({findProgress: i+1});
    }

    let elapsed2 = new Date().getTime() - start2;
    this.setState({findElapsed: elapsed2});
    console.warn("l5vd5 find  : " + elapsed2);
  }
	render () {
    return (
  		<Panel>
  			<Header title="DB8 Test App" />
  			<Button onClick={this.handler}>Test Start</Button>
        <BodyText style={{marginTop: 100}}> PUT progress : {this.state.putElapsed}ms</BodyText>
        <ProgressBar backgroundProgress={1} progress={this.state.putProgress/10000}/>
        <BodyText> FIND progress : {this.state.findElapsed}ms</BodyText>
        <ProgressBar backgroundProgress={1} progress={this.state.findProgress/10000}/>
  		</Panel>
   )
  }
}
