// @desc    Get real-time weather and 7-day forecast (Mock API)
// @route   GET /api/weather/forecast
// @access  Private
export const getWeatherForecast = async (req, res) => {
  try {
    const mockWeather = {
      current: {
        temp: 31,
        humidity: 62,
        windSpeed: 14, // km/h
        rainfall: 0, // mm
        description: 'Partly Cloudy',
        icon: 'cloudy',
        alerts: [
          { type: 'info', message: 'Optimal time for sowing wheat crops' }
        ]
      },
      forecast: [
        { day: 'Mon', temp: 31, condition: 'Sunny' },
        { day: 'Tue', temp: 29, condition: 'Rainy' },
        { day: 'Wed', temp: 28, condition: 'Thunderstorm' },
        { day: 'Thu', temp: 30, condition: 'Cloudy' },
        { day: 'Fri', temp: 32, condition: 'Sunny' },
        { day: 'Sat', temp: 33, condition: 'Sunny' },
        { day: 'Sun', temp: 31, condition: 'Sunny' }
      ],
      agriculturalInsights: [
        'Due to expected light rain on Tuesday/Wednesday, hold off on active pesticide spraying until Thursday.',
        'Soil moisture is estimated to remain moderate. Irrigate fields lightly on Monday morning.'
      ]
    };

    res.json(mockWeather);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve weather forecast' });
  }
};
