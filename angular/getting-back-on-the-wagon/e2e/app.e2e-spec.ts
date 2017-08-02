import { GettingBackOnTheWagonPage } from './app.po';

describe('getting-back-on-the-wagon App', () => {
  let page: GettingBackOnTheWagonPage;

  beforeEach(() => {
    page = new GettingBackOnTheWagonPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
