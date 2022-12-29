import Vue from 'vue'
const moment = require('moment')
require('moment/locale/es')
import { DateTime } from 'luxon'
 
Vue.use(require('vue-moment'), {
  moment
})

Vue.filter('dbDateToFormat', (value, format) => {
  // (Examples below given for 2014-08-06T13:07:04.054 considered as a local time in America/New_York).
  //  ____________________________________________________________________________________________________________________________________________
  // | S	    |	millisecond, no padding                                           |	54                                                            |
  // | SSS  	|	millisecond, padded to 3                                          | 054                                                           |
  // | u	    |	fractional seconds, functionally identical to SSS                 |	054                                                           |
  // | s	    |	second, no padding                                                |	4                                                             |
  // | ss	    |	second, padded to 2 padding                                       |	04                                                            |
  // | m	    |	minute, no padding                                                |	7                                                             |
  // | mm	    |	minute, padded to 2                                               |	07                                                            |
  // | h	    |	hour in 12-hour time, no padding                                  |	1                                                             |
  // | hh	    |	hour in 12-hour time, padded to 2                                 |	01                                                            |
  // | H	    |	hour in 24-hour time, no padding                                  |	9                                                             |
  // | HH	    |	hour in 24-hour time, padded to 2                                 |	13                                                            |
  // | Z	    |	narrow offset                                                     |	+5                                                            |
  // | ZZ	    |	short offset                                                      |	+05:00                                                        |
  // | ZZZ	  |	techie offset                                                     |	+0500                                                         |
  // | ZZZZ	  |	abbreviated named offset                                          |	EST                                                           |
  // | ZZZZZ	|	unabbreviated named offset                                        |	Eastern Standard Time                                         |
  // | z	    |	IANA zone                                                         |	America/New_York                                              |
  // | a	    |	meridiem                                                          |	AM                                                            |
  // | d	    |	day of the month, no padding                                      |	6                                                             |
  // | dd	    |	day of the month, padded to 2                                     |	06                                                            |
  // | c      |	E	day of the week, as number from 1-7 (Monday is 1, Sunday is 7)  |	3                                                             |
  // | ccc    |	EEE	day of the week, as an abbreviate localized string            |	Wed                                                           |
  // | cccc   |	EEEE	day of the week, as an unabbreviated localized string       |	Wednesday                                                     |
  // | ccccc  |	EEEEE	day of the week, as a single localized letter               |	W                                                             |
  // | L      |	M	month as an unpadded number                                     |	8                                                             |
  // | LL     |	MM	month as an padded number                                     |	08                                                            |
  // | LLL    |	MMM	month as an abbreviated localized string                      |	Aug                                                           |
  // | LLLL   |	MMMM	month as an unabbreviated localized string                  |	August                                                        |
  // | LLLLL  |	MMMMM	month as a single localized letter                          |	A                                                             |
  // | y	    |	year, unpadded                                                    |	2014                                                          |
  // | yy	    |	two-digit year                                                    |	14                                                            |
  // | yyyy	  |	four- to six- digit year, pads to 4                               |	2014                                                          |
  // | G	    |	abbreviated localized era                                         |	AD                                                            |
  // | GG	    |	unabbreviated localized era                                       |	Anno Domini                                                   |
  // | GGGGG	|	one-letter localized era                                          |	A                                                             |
  // | kk	    |	ISO week year, unpadded                                           |	14                                                            |
  // | kkkk	  |	ISO week year, padded to 4                                        |	2014                                                          |
  // | W	    |	ISO week number, unpadded                                         |	32                                                            |
  // | WW	    |	ISO week number, padded to 2                                      |	32                                                            |
  // | o	    |	ordinal (day of year), unpadded                                   |	218                                                           |
  // | ooo	  |	ordinal (day of year), padded to 3                                |	218                                                           |
  // | q	    |	quarter, no padding                                               |	3                                                             |
  // | qq	    |	quarter, padded to 2                                              |	03                                                            |
  // | D	    |	localized numeric date                                            |	9/4/2017                                                      |
  // | DD	    |	localized date with abbreviated month                             |	Aug 6, 2014                                                   |
  // | DDD	  |	localized date with full month                                    |	August 6, 2014                                                |
  // | DDDD	  |	localized date with full month and weekday                        |	Wednesday, August 6, 2014                                     |
  // | t	    |	localized time                                                    |	9:07 AM                                                       |
  // | tt	    |	localized time with seconds                                       |	1:07:04 PM                                                    |
  // | ttt	  |	localized time with seconds and abbreviated offset                |	1:07:04 PM EDT                                                |
  // | tttt	  |	localized time with seconds and full offset                       |	1:07:04 PM Eastern Daylight Time                              |
  // | T	    |	localized 24-hour time                                            |	13:07                                                         |
  // | TT	    |	localized 24-hour time with seconds                               |	13:07:04                                                      |
  // | TTT	  |	localized 24-hour time with seconds and abbreviated offset        |	13:07:04 EDT                                                  |
  // | TTTT	  |	localized 24-hour time with seconds and full offset               |	13:07:04 Eastern Daylight Time                                |
  // | f	    |	short localized date and time                                     |	8/6/2014, 1:07 PM                                             |
  // | ff	    |	less short localized date and time                                |	Aug 6, 2014, 1:07 PM                                          |
  // | fff	  |	verbose localized date and time                                   |	August 6, 2014, 1:07 PM EDT                                   |
  // | ffff	  |	extra verbose localized date and time                             |	Wednesday, August 6, 2014, 1:07 PM Eastern Daylight Time      |
  // | F	    |	short localized date and time with seconds                        |	8/6/2014, 1:07:04 PM                                          |
  // | FF	    |	less short localized date and time with seconds                   |	Aug 6, 2014, 1:07:04 PM                                       |
  // | FFF	  |	verbose localized date and time with seconds                      |	August 6, 2014, 1:07:04 PM EDT                                |
  // | FFFF	  |	extra verbose localized date and time with seconds                |	Wednesday, August 6, 2014, 1:07:04 PM Eastern Daylight Time   |
  // | X  	  |	unix timestamp in seconds                                         |	1407287224                                                    |
  // | x	    |	unix timestamp in milliseconds                                    |	1407287224054                                                 |
  // |____________________________________________________________________________________________________________________________________________|
  return DateTime.fromISO(value, { setZone: true }).toFormat(format)
})

Vue.filter('jsDateToFormat', (value, format) => {
  return DateTime.fromJSDate(value, { setZone: true }).toFormat(format)
})

Vue.filter('dbDateToJs', (value, format) => {
  
})

Vue.filter('dbDateUTCToGMTlocal', (value, format = 'DD/MM/YYYY HH:mm') => {
  const date = new Date(value)
  return moment(date).format(format)
})

Vue.filter('title', (value, replacer = '_') => {
  if (!value) return ''
  value = value.toString()
  const arr = value.split(replacer)
  const capitalized_array = []
  arr.map((word) => {
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1)
    capitalized_array.push(capitalized)
  })
  return capitalized_array.join(' ')
})

Vue.filter('currency', (value, decimals = 0, prefix = '', suffix = '') => {
  //Filtro usado para visualizar información de moneda. Para elementos input, debe usarse currencyMask del archivo masks.js
  if (!value) return ''
  const val = (value / 1).toFixed(decimals).replace('.', ',')
  return `${prefix}${val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}${suffix}`
})

Vue.filter('monthName', (date) => {
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const dateParse = new Date(date)
  return monthNames[dateParse.getMonth()]
})