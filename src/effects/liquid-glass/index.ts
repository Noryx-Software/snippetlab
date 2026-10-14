import type { EffectModule } from '../../lib/types';
import { params } from './params';
import { generate } from './generate';
import Preview from './Preview';

const liquidGlass: EffectModule = {
  params,
  flavours: ['vanilla', 'react', 'vue', 'flutter', 'swiftui'],
  generate,
  Preview,
};

export default liquidGlass;
