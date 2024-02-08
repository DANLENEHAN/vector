import {formatDate, parseDate} from '@services/date/Functions';
import {TimestampFormat, DateFormat} from '@shared/Enums';

jest.mock('react-native-localize', () => ({
  getTimeZone: jest.fn().mockReturnValue('Europe/Dublin'),
}));

describe('Date and Time Functions', () => {
  it('formats a timestamp into a UTC timestamp string with ISO8601WithMilliseconds format', () => {
    const timestamp = 1705664136961;
    const formattedDate = formatDate(
      timestamp,
      TimestampFormat.YYYYMMDDHHMMssSSS,
    );
    expect(formattedDate).toBe('2024-01-19T11:35:36.961');
  });

  it('formats a timestamp into a UTC date string with MMDDWithSlash format', () => {
    const timestamp = 1705664136961;
    const formattedDate = formatDate(timestamp, DateFormat.DDMM);
    expect(formattedDate).toBe('19/01');
  });

  it('formats a timestamp into a UTC date string with ISO8601WithMilliseconds format', () => {
    const timestamp = 1705664136961;
    const formattedDate = formatDate(
      timestamp,
      TimestampFormat.YYYYMMDDHHMMssSSS,
    );
    expect(formattedDate).toBe('2024-01-19T11:35:36.961');
  });

  it('parses a formatted date string into a Unix timestamp', () => {
    const formattedDate = '2021-05-03T12:34:56.789';
    const timestamp = parseDate(
      formattedDate,
      TimestampFormat.YYYYMMDDHHMMssSSS,
    );
    expect(timestamp).toBe(1620045296789);
  });

  it('parses a formatted date string with timezone into a Unix timestamp', () => {
    const formattedDate = '2024-01-19T11:35:36.961Z';
    const timestamp = parseDate(
      formattedDate,
      TimestampFormat.YYYYMMDDHHMMssSSS,
    );
    expect(timestamp).toBe(1705664136961);
  });
});
