import './harmonics-editor.scss';
import * as React from 'react';
import { HarmonicBar } from 'components/harmonic-bar/harmonic-bar';

export interface HarmonicsEditorProps {
  onHarmonicChange: Function;
}

/**
 * The harmonics editor show all the bars used to set both harmonics and subharmonics.
 * Harmonics are the overtones, the original frequency times 2, 3, 4 etc.
 * Subharmonics are similar but go the other way, dividing the original frequency by 2, 3, 4 etc.
 */
export class HarmonicsEditor extends React.Component<HarmonicsEditorProps, {}> {
  private harmonics: Array<number>;

  constructor(props: any) {
    super(props);

    this.harmonics = new Array();
    for(let i = -16; i <= 16; i++) {
      // Don't show -1, 0 and 1
      if (i >= -1 && i <=1) {
        continue;
      }
      
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
