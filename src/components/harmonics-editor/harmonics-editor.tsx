import './harmonics-editor.scss';
import * as React from 'react';
import { HarmonicBar } from 'components/harmonic-bar/harmonic-bar';

export interface HarmonicsEditorProps {
  onHarmonicChange: Function;
}

export class HarmonicsEditor extends React.Component<HarmonicsEditorProps, {}> {
  private harmonics: Array<number>;

  constructor(props: any) {
    super(props);

    this.harmonics = new Array();
    for(let i = 2; i <= 32; i++) {
      this.harmonics.push(i);
    }
  }

  render() {
    return <div className='harmonics-editor'>
      {this.harmonics.map((harmonic) => 
        <HarmonicBar key={harmonic} label={harmonic}
          onValueChange={(gain: number) => this.props.onHarmonicChange(harmonic, gain)}/>
        )}
    </div>
  }
}
