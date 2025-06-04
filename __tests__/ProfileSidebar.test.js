import { render, screen } from '@testing-library/react';
import ProfileSidebar from '../src/components/ProfileSidebar';

test('renders github avatar with correct src', () => {
  render(<ProfileSidebar githubUser="testuser" />);
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('src', 'https://github.com/testuser.png');
});
