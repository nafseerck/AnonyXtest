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
define( 'DB_NAME', 'anonyxtest_db' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', '' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'oYWN)$o]<gq]JMeq5Sw;YlJRD,kTD!]Ac!s3Y@=*aO`YJ!*Ck<hB|=EY<o lNqDf' );
define( 'SECURE_AUTH_KEY',  '%Q_OxF#@^mHY8(S?E51(tVEV06 c_P (kw&YANaB&PPh P<lDw3Qap3:]ro^=iQ;' );
define( 'LOGGED_IN_KEY',    '5&Jzz4= @8?T+Z*ZEp=`LOesvOnE*0iC9n<NvV@EZftXu:4W%]xp$F+>S9j5SRc[' );
define( 'NONCE_KEY',        'Wb|n_ i}.5K]QjhrYKhy+1HeOG<:Lp(>wotW(7<8N]--pR>vB1yb`5F6_hm`C;Dc' );
define( 'AUTH_SALT',        '$:a }|`o5_b/j>CzRe/z(m} 3m6Ycnn[qvsl1 ZXDHFL0imhcrbg+Elc6=Ck1>SA' );
define( 'SECURE_AUTH_SALT', '&Vi20SlTs,r,v9LOm0HQE|u3hJ%Cdj932MQh3lCN%=-10xvLZx{N}LXgOo<i/laU' );
define( 'LOGGED_IN_SALT',   '93e,m|Yn[t[`0|{$O/i7GJY<X_3-8i/EM/Jye:_<4^@Iq2^ZdsRI0iG)Q/Tp8l!#' );
define( 'NONCE_SALT',       'H-5D>LD+<UL3){6d(qV.hp!;OGS!tC%jd9n^;w_>}ZMQ8qd2]f@(qBKSpgE3jy)u' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

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
define( 'WP_DEBUG', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );
}

/** Sets up WordPress vars and included files. */
require_once( ABSPATH . 'wp-settings.php' );
