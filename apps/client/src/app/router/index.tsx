import { createBrowserRouter } from 'react-router-dom';
import { Button } from '@shared/components/ui/button';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-4xl font-bold">JobFinder</h1>
        <Button onClick={() => alert('Button Clicked!')}>
          Click Me
        </Button>
      </div>
    ),
  },
]);
