<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'casperkotwal_blog');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'Walkman550@');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'Y&: U@s}WE|w9`$2<_9P85Z+h|Bo _L#lMpeNE&C2[~3c#MD1@1E-+1uI 8~,g@#');
define('SECURE_AUTH_KEY',  '{Q|@(t`_k#+xbc>Df<.g%f{5>QOD1tdM4;/dt$)14*i,(hYHj8tHjqG-;{9<X|59');
define('LOGGED_IN_KEY',    '4*jYgNdvGa|xhARw1M =plmEG(>*ngrWJJE#C(75#C)!f+V%G?DI/&HNRowY*DzC');
define('NONCE_KEY',        '%NU!N4k+4d~@>#_G&H:;2p)Fvq;]-Hp?LzBX4.Zij!FJD1@3(SLHMZ>;W$f)^4DW');
define('AUTH_SALT',        '$6%%TlgX}VX,s1+Z<5>EzW[F7<veY|t1pKa`WCLz><M^0UT<A^zfn=@qJrBuw+-z');
define('SECURE_AUTH_SALT', 'DNF_sXAG[.Oi21)!5dmswZW.y_,XO8=Mt/o~ 3%-b]>7fNY<(k*E[&SMf`z.^HQw');
define('LOGGED_IN_SALT',   'Qq2vJ>U8N&,VOM|0O&-)}o&{AQ:KV$-wk-|]U1$n@uGMPM9Uj%^Rtw_|=potQu/j');
define('NONCE_SALT',       'y{i6Bp:/&CP`2hxR2*Q1x.evR2KEcF#O+OX|6o;70]MaE3cM.Jl=X(o+O.M<?vRC');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
