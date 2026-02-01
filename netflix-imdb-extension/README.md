# Netflix IMDb Ratings Chrome Extension

Displays IMDb ratings on Netflix title cards.

## Setup Instructions

### 1. Get an OMDb API Key
- Go to https://www.omdbapi.com/apikey.aspx
- Sign up for a free API key
- Copy your API key

### 2. Configure the Extension
- Open `content.js`
- Replace `YOUR_API_KEY_HERE` with your actual API key on line 6

### 3. Load the Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `netflix-imdb-extension` folder
5. The extension should now be loaded

### 4. Create Icons (Optional)
The extension references icon files that you can create:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

Or you can remove the icons section from manifest.json if you don't want icons.

## Usage
1. Navigate to https://www.netflix.com
2. Browse titles - IMDb ratings will appear in the top-right corner of each title card
3. Ratings are cached to minimize API calls

## Notes
- Free OMDb API key allows 1,000 requests per day
- Ratings appear after a short delay as they're fetched
- The extension only works on Netflix pages
