import {
  IntersectionObserverDemo,
  MutationObserverDemo,
  ResizeObserverDemo,
  PerformanceObserverDemo,
  ReportingObserverDemo,
} from './components';

type ObserverDemoType =
  | 'intersection'
  | 'mutation'
  | 'resize'
  | 'performance'
  | 'reporting';

interface ObserverDemoProps {
  type?: ObserverDemoType;
}

const componentMap = {
  intersection: IntersectionObserverDemo,
  mutation: MutationObserverDemo,
  resize: ResizeObserverDemo,
  performance: PerformanceObserverDemo,
  reporting: ReportingObserverDemo,
} as const;

const ObserverDemo = ({ type = 'intersection' }: ObserverDemoProps) => {
  const Component = componentMap[type];

  return (
    <div>
      <Component />
    </div>
  );
};
export default ObserverDemo;