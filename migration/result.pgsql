CREATE TABLE IF NOT EXISTS training_type (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

INSERT INTO training_type (name) VALUES ('fat burning') ON CONFLICT DO NOTHING;
INSERT INTO training_type (name) VALUES ('rep building') ON CONFLICT DO NOTHING;
INSERT INTO training_type (name) VALUES ('strength building') ON CONFLICT DO NOTHING;
CREATE TABLE IF NOT EXISTS country (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE,
  alpha2 TEXT UNIQUE,
  alpha3 TEXT UNIQUE,
  un_code TEXT UNIQUE,
  UNIQUE (name, alpha2, alpha3, un_code)
);

INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Afghanistan', 'AF', 'AFG', '004') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Aland Islands', 'AX', 'ALA', '248') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Albania', 'AL', 'ALB', '008') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Algeria', 'DZ', 'DZA', '012') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('American Samoa', 'AS', 'ASM', '016') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Andorra', 'AD', 'AND', '020') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Angola', 'AO', 'AGO', '024') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Anguilla', 'AI', 'AIA', '660') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Antarctica', 'AQ', 'ATA', '010') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Antigua and Barbuda', 'AG', 'ATG', '028') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Argentina', 'AR', 'ARG', '032') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Armenia', 'AM', 'ARM', '051') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Aruba', 'AW', 'ABW', '533') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Australia', 'AU', 'AUS', '036') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Austria', 'AT', 'AUT', '040') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Azerbaijan', 'AZ', 'AZE', '031') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Bahamas', 'BS', 'BHS', '044') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Bahrain', 'BH', 'BHR', '048') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Bangladesh', 'BD', 'BGD', '050') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Barbados', 'BB', 'BRB', '052') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Belarus', 'BY', 'BLR', '112') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Belgium', 'BE', 'BEL', '056') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Belize', 'BZ', 'BLZ', '084') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Benin', 'BJ', 'BEN', '204') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Bermuda', 'BM', 'BMU', '060') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Bhutan', 'BT', 'BTN', '064') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Bolivia', 'BO', 'BOL', '068') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Bosnia and Herzegovina', 'BA', 'BIH', '070') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Botswana', 'BW', 'BWA', '072') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Bouvet Island', 'BV', 'BVT', '074') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Brazil', 'BR', 'BRA', '076') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('British Virgin Islands', 'VG', 'VGB', '092') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('British Indian Ocean Territory', 'IO', 'IOT', '086') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Brunei Darussalam', 'BN', 'BRN', '096') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Bulgaria', 'BG', 'BGR', '100') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Burkina Faso', 'BF', 'BFA', '854') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Burundi', 'BI', 'BDI', '108') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Cambodia', 'KH', 'KHM', '116') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Cameroon', 'CM', 'CMR', '120') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Canada', 'CA', 'CAN', '124') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Cape Verde', 'CV', 'CPV', '132') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Cayman Islands', 'KY', 'CYM', '136') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Central African Republic', 'CF', 'CAF', '140') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Chad', 'TD', 'TCD', '148') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Chile', 'CL', 'CHL', '152') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('China', 'CN', 'CHN', '156') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Hong Kong, SAR China', 'HK', 'HKG', '344') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Macao, SAR China', 'MO', 'MAC', '446') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Christmas Island', 'CX', 'CXR', '162') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Cocos (Keeling) Islands', 'CC', 'CCK', '166') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Colombia', 'CO', 'COL', '170') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Comoros', 'KM', 'COM', '174') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Congo (Brazzaville)', 'CG', 'COG', '178') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Congo, (Kinshasa)', 'CD', 'COD', '180') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Cook Islands', 'CK', 'COK', '184') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Costa Rica', 'CR', 'CRI', '188') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Côte d''Ivoire', 'CI', 'CIV', '384') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Croatia', 'HR', 'HRV', '191') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Cuba', 'CU', 'CUB', '192') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Cyprus', 'CY', 'CYP', '196') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Czech Republic', 'CZ', 'CZE', '203') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Denmark', 'DK', 'DNK', '208') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Djibouti', 'DJ', 'DJI', '262') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Dominica', 'DM', 'DMA', '212') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Dominican Republic', 'DO', 'DOM', '214') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Ecuador', 'EC', 'ECU', '218') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Egypt', 'EG', 'EGY', '818') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('El Salvador', 'SV', 'SLV', '222') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Equatorial Guinea', 'GQ', 'GNQ', '226') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Eritrea', 'ER', 'ERI', '232') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Estonia', 'EE', 'EST', '233') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Ethiopia', 'ET', 'ETH', '231') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Falkland Islands (Malvinas)', 'FK', 'FLK', '238') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Faroe Islands', 'FO', 'FRO', '234') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Fiji', 'FJ', 'FJI', '242') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Finland', 'FI', 'FIN', '246') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('France', 'FR', 'FRA', '250') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('French Guiana', 'GF', 'GUF', '254') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('French Polynesia', 'PF', 'PYF', '258') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('French Southern Territories', 'TF', 'ATF', '260') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Gabon', 'GA', 'GAB', '266') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Gambia', 'GM', 'GMB', '270') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Georgia', 'GE', 'GEO', '268') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Germany', 'DE', 'DEU', '276') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Ghana', 'GH', 'GHA', '288') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Gibraltar', 'GI', 'GIB', '292') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Greece', 'GR', 'GRC', '300') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Greenland', 'GL', 'GRL', '304') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Grenada', 'GD', 'GRD', '308') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Guadeloupe', 'GP', 'GLP', '312') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Guam', 'GU', 'GUM', '316') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Guatemala', 'GT', 'GTM', '320') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Guernsey', 'GG', 'GGY', '831') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Guinea', 'GN', 'GIN', '324') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Guinea-Bissau', 'GW', 'GNB', '624') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Guyana', 'GY', 'GUY', '328') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Haiti', 'HT', 'HTI', '332') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Heard and Mcdonald Islands', 'HM', 'HMD', '334') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Holy See (Vatican City State)', 'VA', 'VAT', '336') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Honduras', 'HN', 'HND', '340') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Hungary', 'HU', 'HUN', '348') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Iceland', 'IS', 'ISL', '352') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('India', 'IN', 'IND', '356') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Indonesia', 'ID', 'IDN', '360') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Iran, Islamic Republic of', 'IR', 'IRN', '364') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Iraq', 'IQ', 'IRQ', '368') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Ireland', 'IE', 'IRL', '372') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Isle of Man', 'IM', 'IMN', '833') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Israel', 'IL', 'ISR', '376') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Italy', 'IT', 'ITA', '380') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Jamaica', 'JM', 'JAM', '388') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Japan', 'JP', 'JPN', '392') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Jersey', 'JE', 'JEY', '832') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Jordan', 'JO', 'JOR', '400') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Kazakhstan', 'KZ', 'KAZ', '398') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Kenya', 'KE', 'KEN', '404') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Kiribati', 'KI', 'KIR', '296') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Korea (North)', 'KP', 'PRK', '408') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Korea (South)', 'KR', 'KOR', '410') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Kuwait', 'KW', 'KWT', '414') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Kyrgyzstan', 'KG', 'KGZ', '417') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Lao PDR', 'LA', 'LAO', '418') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Latvia', 'LV', 'LVA', '428') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Lebanon', 'LB', 'LBN', '422') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Lesotho', 'LS', 'LSO', '426') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Liberia', 'LR', 'LBR', '430') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Libya', 'LY', 'LBY', '434') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Liechtenstein', 'LI', 'LIE', '438') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Lithuania', 'LT', 'LTU', '440') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Luxembourg', 'LU', 'LUX', '442') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Macedonia, Republic of', 'MK', 'MKD', '807') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Madagascar', 'MG', 'MDG', '450') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Malawi', 'MW', 'MWI', '454') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Malaysia', 'MY', 'MYS', '458') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Maldives', 'MV', 'MDV', '462') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Mali', 'ML', 'MLI', '466') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Malta', 'MT', 'MLT', '470') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Marshall Islands', 'MH', 'MHL', '584') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Martinique', 'MQ', 'MTQ', '474') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Mauritania', 'MR', 'MRT', '478') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Mauritius', 'MU', 'MUS', '480') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Mayotte', 'YT', 'MYT', '175') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Mexico', 'MX', 'MEX', '484') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Micronesia, Federated States of', 'FM', 'FSM', '583') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Moldova', 'MD', 'MDA', '498') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Monaco', 'MC', 'MCO', '492') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Mongolia', 'MN', 'MNG', '496') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Montenegro', 'ME', 'MNE', '499') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Montserrat', 'MS', 'MSR', '500') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Morocco', 'MA', 'MAR', '504') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Mozambique', 'MZ', 'MOZ', '508') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Myanmar', 'MM', 'MMR', '104') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Namibia', 'NA', 'NAM', '516') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Nauru', 'NR', 'NRU', '520') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Nepal', 'NP', 'NPL', '524') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Netherlands', 'NL', 'NLD', '528') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Netherlands Antilles', 'AN', 'ANT', '530') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('New Caledonia', 'NC', 'NCL', '540') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('New Zealand', 'NZ', 'NZL', '554') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Nicaragua', 'NI', 'NIC', '558') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Niger', 'NE', 'NER', '562') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Nigeria', 'NG', 'NGA', '566') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Niue', 'NU', 'NIU', '570') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Norfolk Island', 'NF', 'NFK', '574') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Northern Mariana Islands', 'MP', 'MNP', '580') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Norway', 'NO', 'NOR', '578') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Oman', 'OM', 'OMN', '512') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Pakistan', 'PK', 'PAK', '586') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Palau', 'PW', 'PLW', '585') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Palestinian Territory', 'PS', 'PSE', '275') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Panama', 'PA', 'PAN', '591') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Papua New Guinea', 'PG', 'PNG', '598') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Paraguay', 'PY', 'PRY', '600') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Peru', 'PE', 'PER', '604') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Philippines', 'PH', 'PHL', '608') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Pitcairn', 'PN', 'PCN', '612') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Poland', 'PL', 'POL', '616') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Portugal', 'PT', 'PRT', '620') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Puerto Rico', 'PR', 'PRI', '630') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Qatar', 'QA', 'QAT', '634') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Réunion', 'RE', 'REU', '638') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Romania', 'RO', 'ROU', '642') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Russian Federation', 'RU', 'RUS', '643') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Rwanda', 'RW', 'RWA', '646') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Saint-Barthélemy', 'BL', 'BLM', '652') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Saint Helena', 'SH', 'SHN', '654') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Saint Kitts and Nevis', 'KN', 'KNA', '659') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Saint Lucia', 'LC', 'LCA', '662') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Saint-Martin (French part)', 'MF', 'MAF', '663') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Saint Pierre and Miquelon', 'PM', 'SPM', '666') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Saint Vincent and Grenadines', 'VC', 'VCT', '670') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Samoa', 'WS', 'WSM', '882') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('San Marino', 'SM', 'SMR', '674') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Sao Tome and Principe', 'ST', 'STP', '678') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Saudi Arabia', 'SA', 'SAU', '682') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Senegal', 'SN', 'SEN', '686') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Serbia', 'RS', 'SRB', '688') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Seychelles', 'SC', 'SYC', '690') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Sierra Leone', 'SL', 'SLE', '694') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Singapore', 'SG', 'SGP', '702') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Slovakia', 'SK', 'SVK', '703') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Slovenia', 'SI', 'SVN', '705') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Solomon Islands', 'SB', 'SLB', '090') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Somalia', 'SO', 'SOM', '706') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('South Africa', 'ZA', 'ZAF', '710') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('South Georgia and the South Sandwich Islands', 'GS', 'SGS', '239') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('South Sudan', 'SS', 'SSD', '728') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Spain', 'ES', 'ESP', '724') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Sri Lanka', 'LK', 'LKA', '144') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Sudan', 'SD', 'SDN', '736') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Suriname', 'SR', 'SUR', '740') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Svalbard and Jan Mayen Islands', 'SJ', 'SJM', '744') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Swaziland', 'SZ', 'SWZ', '748') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Sweden', 'SE', 'SWE', '752') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Switzerland', 'CH', 'CHE', '756') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Syrian Arab Republic (Syria)', 'SY', 'SYR', '760') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Taiwan, Republic of China', 'TW', 'TWN', '158') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Tajikistan', 'TJ', 'TJK', '762') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Tanzania, United Republic of', 'TZ', 'TZA', '834') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Thailand', 'TH', 'THA', '764') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Timor-Leste', 'TL', 'TLS', '626') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Togo', 'TG', 'TGO', '768') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Tokelau', 'TK', 'TKL', '772') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Tonga', 'TO', 'TON', '776') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Trinidad and Tobago', 'TT', 'TTO', '780') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Tunisia', 'TN', 'TUN', '788') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Turkey', 'TR', 'TUR', '792') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Turkmenistan', 'TM', 'TKM', '795') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Turks and Caicos Islands', 'TC', 'TCA', '796') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Tuvalu', 'TV', 'TUV', '798') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Uganda', 'UG', 'UGA', '800') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Ukraine', 'UA', 'UKR', '804') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('United Arab Emirates', 'AE', 'ARE', '784') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('United Kingdom', 'GB', 'GBR', '826') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('United States of America', 'US', 'USA', '840') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('US Minor Outlying Islands', 'UM', 'UMI', '581') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Uruguay', 'UY', 'URY', '858') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Uzbekistan', 'UZ', 'UZB', '860') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Vanuatu', 'VU', 'VUT', '548') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Venezuela (Bolivarian Republic)', 'VE', 'VEN', '862') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Viet Nam', 'VN', 'VNM', '704') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Virgin Islands, US', 'VI', 'VIR', '850') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Wallis and Futuna Islands', 'WF', 'WLF', '876') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Western Sahara', 'EH', 'ESH', '732') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Yemen', 'YE', 'YEM', '887') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Zambia', 'ZM', 'ZMB', '894') ON CONFLICT DO NOTHING;
INSERT INTO country (name, alpha2, alpha3, un_code) VALUES ('Zimbabwe', 'ZW', 'ZWE', '716') ON CONFLICT DO NOTHING;
CREATE TABLE IF NOT EXISTS sport (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE
);

INSERT INTO sport (name) VALUES ('calisthenic') ON CONFLICT DO NOTHING;
INSERT INTO sport (name) VALUES ('swimming') ON CONFLICT DO NOTHING;
CREATE TABLE IF NOT EXISTS difficulty_level (
  id BIGSERIAL PRIMARY KEY,
  level INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL UNIQUE
);

INSERT INTO difficulty_level (level, name) VALUES (1, 'beginner') ON CONFLICT DO NOTHING;
INSERT INTO difficulty_level (level, name) VALUES (2, 'intermediate') ON CONFLICT DO NOTHING;
INSERT INTO difficulty_level (level, name) VALUES (3, 'advance') ON CONFLICT DO NOTHING;
INSERT INTO difficulty_level (level, name) VALUES (4, 'monster') ON CONFLICT DO NOTHING;
CREATE TABLE IF NOT EXISTS training_duration (
  id SERIAL PRIMARY KEY,
  time INTEGER NOT NULL UNIQUE
);

INSERT INTO training_duration (time) VALUES (30) ON CONFLICT DO NOTHING;
INSERT INTO training_duration (time) VALUES (45) ON CONFLICT DO NOTHING;
INSERT INTO training_duration (time) VALUES (60) ON CONFLICT DO NOTHING;
INSERT INTO training_duration (time) VALUES (75) ON CONFLICT DO NOTHING;
INSERT INTO training_duration (time) VALUES (90) ON CONFLICT DO NOTHING;
INSERT INTO training_duration (time) VALUES (105) ON CONFLICT DO NOTHING;
INSERT INTO training_duration (time) VALUES (120) ON CONFLICT DO NOTHING;
INSERT INTO training_duration (time) VALUES (135) ON CONFLICT DO NOTHING;
INSERT INTO training_duration (time) VALUES (150) ON CONFLICT DO NOTHING;
INSERT INTO training_duration (time) VALUES (165) ON CONFLICT DO NOTHING;
INSERT INTO training_duration (time) VALUES (180) ON CONFLICT DO NOTHING;
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  login TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  is_athlete BOOLEAN DEFAULT FALSE,
  self_info TEXT,
  weight REAL,
  growth REAL,
  birth_date TIMESTAMP WITH TIME ZONE,
  is_banned BOOLEAN DEFAULT FALSE,
  instagram_link TEXT,
  phone TEXT,
  registered_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE TABLE IF NOT EXISTS user_sport_link (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  sport_id BIGINT REFERENCES sport(id) ON DELETE CASCADE,
  UNIQUE (user_id, sport_id)
);
CREATE TABLE IF NOT EXISTS user_country_link (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  country_id BIGINT REFERENCES country(id) ON DELETE CASCADE,
  UNIQUE (user_id, country_id)
);
CREATE TABLE IF NOT EXISTS exercise_template (
  id BIGSERIAL PRIMARY KEY, -- this id for video in fs too
  title TEXT NOT NULL,
  description TEXT,
  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  sport_id BIGINT REFERENCES sport(id) ON DELETE RESTRICT,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exercise (
  id BIGSERIAL PRIMARY KEY,
  exercise_template_id BIGINT REFERENCES exercise_template(id) ON DELETE RESTRICT,
  duration INTEGER DEFAULT 0, -- by seconds
  reps INTEGER DEFAULT 0,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Программа тренировок создается по выбору на кол-во дней (max 30 дней за раз, minimum 1 день)
CREATE TABLE IF NOT EXISTS program (
  id BIGSERIAL PRIMARY KEY, -- identification for image
  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  sport_id BIGINT REFERENCES sport(id) ON DELETE RESTRICT,
  price DECIMAL(19,2) DEFAULT 0,
  difficulty_level INTEGER REFERENCES difficulty_level(level) ON DELETE RESTRICT, -- automatic on server aggregate all trainings difficulties
  modified_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);


CREATE OR REPLACE FUNCTION update_program_modified_date() RETURNS TRIGGER AS
  $BODY$
    BEGIN
      UPDATE program SET modified_date=now();
      RETURN new;
    END;
  $BODY$
  LANGUAGE plpgsql;

CREATE TRIGGER programUpdate AFTER UPDATE ON program FOR EACH ROW EXECUTE PROCEDURE update_program_modified_date();
CREATE TABLE IF NOT EXISTS training (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty_level INTEGER REFERENCES difficulty_level(level) ON DELETE RESTRICT,
  is_daily BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT TRUE,
  type_id INTEGER REFERENCES training_type(id) ON DELETE RESTRICT,
  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  sport_id BIGINT REFERENCES sport(id) ON DELETE RESTRICT,
  duration INTEGER REFERENCES training_duration(id) ON DELETE RESTRICT,
  modified_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS training_round (
  id BIGSERIAL PRIMARY KEY,
  training_id BIGINT REFERENCES training(id) ON DELETE CASCADE,
  sets INTEGER DEFAULT 1,
  position INTEGER NOT NULL,
  exercises BIGINT[]
);

CREATE TABLE IF NOT EXISTS training_program_link (
  id BIGSERIAL PRIMARY KEY,
  program_id BIGINT REFERENCES program(id) ON DELETE CASCADE,
  training_id BIGINT REFERENCES training(id) ON DELETE RESTRICT,
  day INTEGER NOT NULL
);


CREATE OR REPLACE FUNCTION update_training_modified_date() RETURNS TRIGGER AS
  $BODY$
    BEGIN
      UPDATE training SET modified_date=now();
      RETURN new;
    END;
  $BODY$
  LANGUAGE plpgsql;

CREATE TRIGGER trainingUpdate AFTER UPDATE ON training FOR EACH ROW EXECUTE PROCEDURE update_training_modified_date();
CREATE TABLE IF NOT EXISTS bought_program (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  program_id BIGINT REFERENCES program(id) ON DELETE RESTRICT,
  transaction TEXT NOT NULL,
  bought_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE TABLE IF NOT EXISTS user_program_saved (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  program_id BIGINT REFERENCES program(id) ON DELETE CASCADE,
  UNIQUE (user_id, program_id)
);

CREATE TABLE IF NOT EXISTS user_training_saved (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  training_id BIGINT REFERENCES training(id) ON DELETE CASCADE,
  UNIQUE (user_id, training_id)
);

