import { DatabaseType } from '@/lib/domain/database-type';
import type { Template } from './templates-data';

import image0 from '@/assets/templates/employeedb.png';
import imageDark0 from '@/assets/templates/employeedb-dark.png';
import image1 from '@/assets/templates/visual-novel-db.png';
import imageDark1 from '@/assets/templates/visual-novel-db-dark.png';
import image2 from '@/assets/templates/airbnb.png';
import imageDark2 from '@/assets/templates/airbnb-dark.png';
import image3 from '@/assets/templates/wordpress-db.png';
import imageDark3 from '@/assets/templates/wordpress-db-dark.png';
import image4 from '@/assets/templates/pokemon.png';
import imageDark4 from '@/assets/templates/pokemon-dark.png';
import image5 from '@/assets/templates/adonis-acl.png';
import imageDark5 from '@/assets/templates/adonis-acl-dark.png';
import image6 from '@/assets/templates/akaunting.png';
import imageDark6 from '@/assets/templates/akaunting-dark.png';
import image7 from '@/assets/templates/django-db.png';
import imageDark7 from '@/assets/templates/django-db-dark.png';
import image8 from '@/assets/templates/twitter-db.png';
import imageDark8 from '@/assets/templates/twitter-db-dark.png';
import image9 from '@/assets/templates/laravel-db.png';
import imageDark9 from '@/assets/templates/laravel-db-dark.png';
import image10 from '@/assets/templates/laravel-spark-db.png';
import imageDark10 from '@/assets/templates/laravel-spark-db-dark.png';
import image11 from '@/assets/templates/voyager-db.png';
import imageDark11 from '@/assets/templates/voyager-db-dark.png';
import image12 from '@/assets/templates/koel-db.png';
import imageDark12 from '@/assets/templates/koel-db-dark.png';
import image13 from '@/assets/templates/laravel-permission-db.png';
import imageDark13 from '@/assets/templates/laravel-permission-db-dark.png';
import image14 from '@/assets/templates/gravity-db.png';
import imageDark14 from '@/assets/templates/gravity-db-dark.png';
import image15 from '@/assets/templates/ticketit-db.png';
import imageDark15 from '@/assets/templates/ticketit-db-dark.png';
import image16 from '@/assets/templates/lobsters-db.png';
import imageDark16 from '@/assets/templates/lobsters-db-dark.png';
import image17 from '@/assets/templates/refinerycms-db.png';
import imageDark17 from '@/assets/templates/refinerycms-db-dark.png';
import image18 from '@/assets/templates/buddypress.png';
import imageDark18 from '@/assets/templates/buddypress-dark.png';
import image19 from '@/assets/templates/snipe-it-db.png';
import imageDark19 from '@/assets/templates/snipe-it-db-dark.png';
import image20 from '@/assets/templates/comfortable-mexican-sofa-db.png';
import imageDark20 from '@/assets/templates/comfortable-mexican-sofa-db-dark.png';
import image21 from '@/assets/templates/sylius-db.png';
import imageDark21 from '@/assets/templates/sylius-db-dark.png';
import image22 from '@/assets/templates/monica-db.png';
import imageDark22 from '@/assets/templates/monica-db-dark.png';
import image23 from '@/assets/templates/attendize-db.png';
import imageDark23 from '@/assets/templates/attendize-db-dark.png';
import image24 from '@/assets/templates/saas-pegasus-db.png';
import imageDark24 from '@/assets/templates/saas-pegasus-db-dark.png';
import image25 from '@/assets/templates/bookstack-db.png';
import imageDark25 from '@/assets/templates/bookstack-db-dark.png';
import image26 from '@/assets/templates/bouncer-db.png';
import imageDark26 from '@/assets/templates/bouncer-db-dark.png';
import image27 from '@/assets/templates/cabot-db.png';
import imageDark27 from '@/assets/templates/cabot-db-dark.png';
import image28 from '@/assets/templates/feedbin-db.png';
import imageDark28 from '@/assets/templates/feedbin-db-dark.png';
import image29 from '@/assets/templates/freescout-db.png';
import imageDark29 from '@/assets/templates/freescout-db-dark.png';
import image30 from '@/assets/templates/hacker-news-db.png';
import imageDark30 from '@/assets/templates/hacker-news-db-dark.png';
import image31 from '@/assets/templates/flarum-db.png';
import imageDark31 from '@/assets/templates/flarum-db-dark.png';
import image32 from '@/assets/templates/canvas-db.png';
import imageDark32 from '@/assets/templates/canvas-db-dark.png';
import image33 from '@/assets/templates/taggit-db.png';
import imageDark33 from '@/assets/templates/taggit-db-dark.png';
import image34 from '@/assets/templates/doorkeeper-db.png';
import imageDark34 from '@/assets/templates/doorkeeper-db-dark.png';
import image35 from '@/assets/templates/orchid-db.png';
import imageDark35 from '@/assets/templates/orchid-db-dark.png';
import image36 from '@/assets/templates/flipper-db.png';
import imageDark36 from '@/assets/templates/flipper-db-dark.png';
import image37 from '@/assets/templates/cachet-db.png';
import imageDark37 from '@/assets/templates/cachet-db-dark.png';
import image38 from '@/assets/templates/reversion-db.png';
import imageDark38 from '@/assets/templates/reversion-db-dark.png';
import image39 from '@/assets/templates/screeenly-db.png';
import imageDark39 from '@/assets/templates/screeenly-db-dark.png';
import image40 from '@/assets/templates/staytus-db.png';
import imageDark40 from '@/assets/templates/staytus-db-dark.png';
import image41 from '@/assets/templates/deployer-db.png';
import imageDark41 from '@/assets/templates/deployer-db-dark.png';
import image42 from '@/assets/templates/devise-db.png';
import imageDark42 from '@/assets/templates/devise-db-dark.png';
import image43 from '@/assets/templates/talk-db.png';
import imageDark43 from '@/assets/templates/talk-db-dark.png';
import image44 from '@/assets/templates/octobox-db.png';
import imageDark44 from '@/assets/templates/octobox-db-dark.png';
import image45 from '@/assets/templates/pay-rails-db.png';
import imageDark45 from '@/assets/templates/pay-rails-db-dark.png';
import image46 from '@/assets/templates/laravel-activitylog-db.png';
import imageDark46 from '@/assets/templates/laravel-activitylog-db-dark.png';
import image47 from '@/assets/templates/pixelfed-db.png';
import imageDark47 from '@/assets/templates/pixelfed-db-dark.png';
import image48 from '@/assets/templates/polr-db.png';
import imageDark48 from '@/assets/templates/polr-db-dark.png';
import image49 from '@/assets/templates/django-axes-db.png';
import imageDark49 from '@/assets/templates/django-axes-db-dark.png';

export interface TemplateManifest {
    slug: string;
    name: string;
    shortDescription: string;
    description: string;
    image: string;
    imageDark: string;
    databaseType: DatabaseType;
    tags: string[];
    featured: boolean;
    url?: string;
    loadTemplate: () => Promise<Template>;
}

export const templateManifests: TemplateManifest[] = [
    {
        slug: 'employees-database',
        name: 'Employees',
        shortDescription: 'Employees, departments, and salaries',
        description:
            'A schema for database of employees, departments, and salaries.',
        image: image0,
        imageDark: imageDark0,
        databaseType: DatabaseType.MYSQL,
        tags: ['MySQL'],
        featured: true,
        loadTemplate: () =>
            import('./templates/employee-db').then(
                (module) => module.employeeDb
            ),
    },
    {
        slug: 'visual-novel-database',
        name: 'Visual Novel Database',
        shortDescription: 'Visual Novel Database',
        description:
            'A comprehensive database for information about visual novels.',
        image: image1,
        imageDark: imageDark1,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Visual Novel Database'],
        featured: false,
        url: 'https://vndb.org',
        loadTemplate: () =>
            import('./templates/visual-novel-db').then(
                (module) => module.visualNovelDb
            ),
    },
    {
        slug: 'airbnb-database',
        name: 'Airbnb',
        shortDescription: 'Short-term Vacation Rentals',
        description: 'Example database schema diagram for Airbnb',
        image: image2,
        imageDark: imageDark2,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Example Apps'],
        featured: true,
        loadTemplate: () =>
            import('./templates/airbnb-db').then((module) => module.airbnbDb),
    },
    {
        slug: 'wordpress-database',
        name: 'WordPress',
        shortDescription: 'An open-source PHP Content Management System',
        description:
            '(CMS) ideal for building websites, blogs, or apps. Flexible, customizable, and designed for developers to expand',
        image: image3,
        imageDark: imageDark3,
        databaseType: DatabaseType.MYSQL,
        tags: ['MySQL', 'Open Source', 'WordPress', 'PHP'],
        featured: true,
        url: 'https://wordpress.org',
        loadTemplate: () =>
            import('./templates/wordpress-db').then(
                (module) => module.wordpressDb
            ),
    },
    {
        slug: 'pokemon-database',
        name: 'Pokemon',
        shortDescription: 'Pokemon information',
        description: 'Mysql Relational of 722 pokemons. 14 Tables 5 views.',
        image: image4,
        imageDark: imageDark4,
        databaseType: DatabaseType.MYSQL,
        tags: ['MySQL', 'Pokemon', 'Example Apps'],
        featured: true,
        url: 'https://github.com/brianr852/Pokemon-Database',
        loadTemplate: () =>
            import('./templates/pokemon-db').then((module) => module.pokemonDb),
    },
    {
        slug: 'adonis-acl-database',
        name: 'Adonis Acl Database',
        shortDescription: 'Role based permissions',
        description:
            'Adonis ACL adds role based permissions to built in Auth System of Adonis Framework.',
        image: image5,
        imageDark: imageDark5,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Node.js'],
        featured: false,
        url: 'https://github.com/enniel/adonis-acl',
        loadTemplate: () =>
            import('./templates/adonis-acl-db').then(
                (module) => module.adonisAclDb
            ),
    },
    {
        slug: 'akaunting-database',
        name: 'Akaunting',
        shortDescription: 'Online Accounting Software',
        description:
            'For small businesses and freelancers, built with Laravel and VueJS',
        image: image6,
        imageDark: imageDark6,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Laravel', 'PHP'],
        featured: false,
        url: 'https://github.com/akaunting/akaunting',
        loadTemplate: () =>
            import('./templates/akaunting-db').then(
                (module) => module.akauntingDb
            ),
    },
    {
        slug: 'django-database',
        name: 'Django',
        shortDescription: 'High-level Python web framework',
        description:
            'For rapid, clean web app development, with tools, migrations, and database tables',
        image: image7,
        imageDark: imageDark7,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Django', 'Python'],
        featured: true,
        url: 'https://github.com/django/django',
        loadTemplate: () =>
            import('./templates/django-db').then((module) => module.djangoDb),
    },
    {
        slug: 'twitter-database',
        name: 'Twitter Database',
        shortDescription: 'Social media platform clone application',
        description:
            'Built with React - Example database schema diagram for twitter',
        image: image8,
        imageDark: imageDark8,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Example Apps'],
        featured: true,
        url: 'https://github.com/SukhjinderArora/twitter-clone',
        loadTemplate: () =>
            import('./templates/twitter-db').then((module) => module.twitterDb),
    },
    {
        slug: 'laravel-database',
        name: 'Laravel',
        shortDescription: 'PHP web framework',
        description:
            'With elegant syntax, simplifying web development by streamlining common tasks across projects',
        image: image9,
        imageDark: imageDark9,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Laravel', 'PHP'],
        featured: true,
        url: 'https://github.com/laravel/laravel',
        loadTemplate: () =>
            import('./templates/laravel-db').then((module) => module.laravelDb),
    },
    {
        slug: 'laravel-spark-database',
        name: 'Laravel Spark',
        shortDescription: 'Recurring billing solution for Laravel',
        description: 'A starter-kit for your next great SaaS application',
        image: image10,
        imageDark: imageDark10,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Laravel', 'PHP'],
        featured: false,
        url: 'https://github.com/laravel/spark-aurelius',
        loadTemplate: () =>
            import('./templates/laravel-spark-db').then(
                (module) => module.laravelSparkDb
            ),
    },
    {
        slug: 'voyager-database',
        name: 'Voyager',
        shortDescription: 'The Missing Admin for Laravel',
        description:
            'Package with Media Manager, Menu Builder, Database Manager, and CRUD tools.',
        image: image11,
        imageDark: imageDark11,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Laravel', 'PHP'],
        featured: false,
        url: 'https://voyager.devdojo.com',
        loadTemplate: () =>
            import('./templates/voyager-db').then((module) => module.voyagerDb),
    },
    {
        slug: 'koel-database',
        name: 'Koel | koel.dev',
        shortDescription: 'Music streaming server',
        description: 'schema for Koel open source software',
        image: image12,
        imageDark: imageDark12,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Laravel', 'PHP'],
        featured: false,
        url: 'https://koel.dev',
        loadTemplate: () =>
            import('./templates/koel-db').then((module) => module.koelDb),
    },
    {
        slug: 'laravel-permission-database',
        name: 'Laravel Permission',
        shortDescription: 'Roles and Permission For Laravel',
        description:
            'Associate users with roles and permissions (Laravel-Permission on github)',
        image: image13,
        imageDark: imageDark13,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Laravel', 'PHP'],
        featured: false,
        url: 'https://github.com/spatie/laravel-permission',
        loadTemplate: () =>
            import('./templates/laravel-permission-db').then(
                (module) => module.laravelPermissionDb
            ),
    },
    {
        slug: 'gravity-database',
        name: 'Gravity',
        shortDescription: 'Node.js SaaS Boilerplate',
        description:
            'by Kyle Gawley, is a SaaS boilerplate with a React UI, built to jumpstart Node.js SaaS app development',
        image: image14,
        imageDark: imageDark14,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'SaaS', 'Node.js'],
        featured: false,
        url: 'https://usegravity.app',
        loadTemplate: () =>
            import('./templates/gravity-db').then((module) => module.gravityDb),
    },
    {
        slug: 'ticketit-database',
        name: 'Ticketit',
        shortDescription: 'A simple helpdesk tickets system for Laravel',
        description:
            'Which integrates smoothly with Laravel default users and auth system',
        image: image15,
        imageDark: imageDark15,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Laravel', 'PHP'],
        featured: false,
        url: 'https://github.com/spatie/ticketit',
        loadTemplate: () =>
            import('./templates/ticketit-db').then(
                (module) => module.ticketitDb
            ),
    },
    {
        slug: 'lobsters-database',
        name: 'Lobsters',
        shortDescription: 'Computing-focused community centered',
        description:
            'Around link aggregation and discussion - Example database schema diagram for lobsters',
        image: image16,
        imageDark: imageDark16,
        databaseType: DatabaseType.MYSQL,
        tags: ['Postgres', 'Example Apps'],
        featured: false,
        url: 'https://github.com/SukhjinderArora/lobsters-clone',
        loadTemplate: () =>
            import('./templates/lobsters-db').then(
                (module) => module.lobstersDb
            ),
    },
    {
        slug: 'refinerycms-database',
        name: 'Refinerycms',
        shortDescription: 'Ruby on Rails - Content management system',
        description:
            'Is the leading open source CMS on the Ruby on Rails framework. For creating custom content manageable websites',
        image: image17,
        imageDark: imageDark17,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Rails', 'CMS'],
        featured: true,
        url: 'https://github.com/refinery/refinerycms',
        loadTemplate: () =>
            import('./templates/refinerycms-db').then(
                (module) => module.refinerycmsDb
            ),
    },
    {
        slug: 'buddypress-database',
        name: 'BuddyPress',
        shortDescription: 'Social networking plugin for WordPress',
        description:
            'Transform your WordPress site into a social network with profiles, groups, messaging, and more by Automattic',
        image: image18,
        imageDark: imageDark18,
        databaseType: DatabaseType.MYSQL,
        tags: ['Postgres', 'Open Source', 'WordPress'],
        featured: false,
        url: 'https://buddypress.org',
        loadTemplate: () =>
            import('./templates/buddypress-db').then(
                (module) => module.buddypressDb
            ),
    },
    {
        slug: 'snipe-it-database',
        name: 'Snipe-It',
        shortDescription: 'Free open source IT asset management',
        description:
            'For tracking and visualizing assets with a Laravel-powered schema',
        image: image19,
        imageDark: imageDark19,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Laravel', 'PHP'],
        featured: false,
        url: 'https://github.com/snipe/snipe-it',
        loadTemplate: () =>
            import('./templates/snipe-it-db').then(
                (module) => module.snipeItDb
            ),
    },
    {
        slug: 'comfortable-mexican-sofa-database',
        name: 'Comfortable Mexican Sofa',
        shortDescription: 'Rails CMS - ComfortableMexicanSofa',
        description:
            'A powerful Ruby on Rails 5.2+ CMS (Content Management System) Engine',
        image: image20,
        imageDark: imageDark20,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Rails', 'CMS'],
        featured: false,
        url: 'https://github.com/comfy/comfortable-mexican-sofa',
        loadTemplate: () =>
            import('./templates/comfortable-mexican-sofa-db').then(
                (module) => module.comfortableMexicanSofaDb
            ),
    },
    {
        slug: 'sylius-database',
        name: 'Sylius',
        shortDescription: 'eCommerce framework',
        description: 'Open Source eCommerce Framework on Symfony',
        image: image21,
        imageDark: imageDark21,
        databaseType: DatabaseType.MYSQL,
        tags: ['MySQL', 'Open Source', 'Symfony', 'PHP'],
        featured: true,
        url: 'https://github.com/Sylius/Sylius',
        loadTemplate: () =>
            import('./templates/sylius-db').then((module) => module.syliusDb),
    },
    {
        slug: 'monica-database',
        name: 'Monica',
        shortDescription: 'eCommerce framework',
        description: 'Open Source eCommerce Framework on Symfony',
        image: image22,
        imageDark: imageDark22,
        databaseType: DatabaseType.MYSQL,
        tags: ['MySQL', 'Open Source', 'Laravel'],
        featured: true,
        url: 'https://github.com/monicahq/monica',
        loadTemplate: () =>
            import('./templates/monica-db').then((module) => module.monicaDb),
    },
    {
        slug: 'attendize-database',
        name: 'Attendize',
        shortDescription: 'Ticketing platform',
        description: 'Ticket selling and event management platform',
        image: image23,
        imageDark: imageDark23,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['MySQL', 'Open Source', 'Laravel', 'PHP'],
        featured: true,
        url: 'https://github.com/attendizehq/attendize',
        loadTemplate: () =>
            import('./templates/attendize-db').then(
                (module) => module.attendizeDb
            ),
    },
    {
        slug: 'saas-pegasus-database',
        name: 'SaaS Pegasus',
        shortDescription: 'Django-based SaaS template',
        description: 'SaaS Pegasus is a Django-based boilerplate',
        image: image24,
        imageDark: imageDark24,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Python', 'Django'],
        featured: true,
        url: 'https://www.saaspegasus.com',
        loadTemplate: () =>
            import('./templates/saas-pegasus-db').then(
                (module) => module.saasPegasusDb
            ),
    },
    {
        slug: 'bookstack-database',
        name: 'BookStack',
        shortDescription: 'Simple & Free Wiki Software',
        description: 'Platform to create documentation/wiki',
        image: image25,
        imageDark: imageDark25,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Open Source', 'Laravel', 'PHP'],
        featured: true,
        url: 'https://github.com/bookstackhq/bookstack',
        loadTemplate: () =>
            import('./templates/bookstack-db').then(
                (module) => module.bookstackDb
            ),
    },
    {
        slug: 'bouncer-database',
        name: 'Bouncer',
        shortDescription: 'Laravel Eloquent roles and abilities',
        description:
            'framework-agnostic approach to managing roles and abilities for any app using Eloquent models.',
        image: image26,
        imageDark: imageDark26,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Laravel', 'PHP'],
        featured: false,
        url: 'https://github.com/JosephSilber/bouncer',
        loadTemplate: () =>
            import('./templates/bouncer-db').then((module) => module.bouncerDb),
    },
    {
        slug: 'cabot-database',
        name: 'Cabot',
        shortDescription: 'Monitoring and alerts service',
        description:
            'Self-hosted, easily-deployable monitoring and alerts service - like a lightweight PagerDuty.',
        image: image27,
        imageDark: imageDark27,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Python', 'Django'],
        featured: false,
        url: 'https://github.com/arachnys/cabot',
        loadTemplate: () =>
            import('./templates/cabot-db').then((module) => module.cabotDb),
    },
    {
        slug: 'feedbin-database',
        name: 'Feedbin',
        shortDescription: 'Simple RSS reader',
        description:
            'Feedbin is a simple, open source, and privacy-respecting RSS reader.',
        image: image28,
        imageDark: imageDark28,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Rails'],
        featured: false,
        url: 'https://github.com/feedbin/feedbin',
        loadTemplate: () =>
            import('./templates/feedbin-db').then((module) => module.feedbinDb),
    },
    {
        slug: 'freescout-database',
        name: 'Freescout',
        shortDescription: 'Self-Hosted Zendesk',
        description:
            'Free self-hosted help desk & shared mailbox (Zendesk / Help Scout alternative)',
        image: image29,
        imageDark: imageDark29,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Laravel', 'PHP'],
        featured: false,
        url: 'https://github.com/freescout-help-desk/freescout',
        loadTemplate: () =>
            import('./templates/freescout-db').then(
                (module) => module.freescoutDb
            ),
    },
    {
        slug: 'hacker-news-database',
        name: 'Pythonic News',
        shortDescription: 'A Hacker News lookalike',
        description:
            'written in Python/Django. Platform - https://news.python.sc',
        image: image30,
        imageDark: imageDark30,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Python', 'Django'],
        featured: false,
        url: 'https://github.com/sebst/pythonic-news',
        loadTemplate: () =>
            import('./templates/hacker-news-db').then(
                (module) => module.hackerNewsDb
            ),
    },
    {
        slug: 'flarum-database',
        name: 'Flarum',
        shortDescription: 'Discussion platform',
        description: 'Simple forum software for building great communities.',
        image: image31,
        imageDark: imageDark31,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Laravel', 'PHP'],
        featured: false,
        url: 'https://flarum.org',
        loadTemplate: () =>
            import('./templates/flarum-db').then((module) => module.flarumDb),
    },
    {
        slug: 'canvas-database',
        name: 'Canvas',
        shortDescription: 'Publishing on your own terms',
        description:
            'A simple, open source extend your existing Laravel application and get you up-and-running with a blog in just a few minutes.',
        image: image32,
        imageDark: imageDark32,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Laravel', 'PHP'],
        featured: false,
        url: 'https://github.com/austintoddj/canvas',
        loadTemplate: () =>
            import('./templates/canvas-db').then((module) => module.canvasDb),
    },
    {
        slug: 'taggit-database',
        name: 'Taggit',
        shortDescription: 'Simple tagging for django',
        description:
            'Django-taggit adds simple tagging to Django models via TaggableManager, perfect for content categorization.',
        image: image33,
        imageDark: imageDark33,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Python', 'Django'],
        featured: true,
        url: 'https://github.com/jazzband/django-taggit',
        loadTemplate: () =>
            import('./templates/taggit-db').then((module) => module.taggitDb),
    },
    {
        slug: 'doorkeeper-database',
        name: 'Doorkeeper',
        shortDescription: 'Rails OAuth 2 provider',
        description:
            'Doorkeeper is an OAuth 2 provider for Ruby on Rails / Grape.',
        image: image34,
        imageDark: imageDark34,
        databaseType: DatabaseType.MYSQL,
        tags: ['MySQL', 'Open Source', 'Rails'],
        featured: true,
        url: 'https://github.com/doorkeeper-gem/doorkeeper',
        loadTemplate: () =>
            import('./templates/doorkeeper-db').then(
                (module) => module.doorkeeperDb
            ),
    },
    {
        slug: 'orchid-database',
        name: 'Orchid',
        shortDescription: 'Back-Office platform',
        description:
            'A Laravel package of back-office applications, admin/user panels, and dashboards.',
        image: image35,
        imageDark: imageDark35,
        databaseType: DatabaseType.MYSQL,
        tags: ['Postgres', 'Open Source', 'Laravel', 'PHP'],
        featured: false,
        url: 'https://github.com/orchidsoftware/platform',
        loadTemplate: () =>
            import('./templates/orchid-db').then((module) => module.orchidDb),
    },
    {
        slug: 'flipper-database',
        name: 'Flipper',
        shortDescription: 'Feature flags for Ruby',
        description: 'Beautiful, performant feature flags for Ruby and Rails.',
        image: image36,
        imageDark: imageDark36,
        databaseType: DatabaseType.MYSQL,
        tags: ['MySQL', 'Open Source', 'Rails'],
        featured: true,
        url: 'https://github.com/flippercloud/flipper',
        loadTemplate: () =>
            import('./templates/flipper-db').then((module) => module.flipperDb),
    },
    {
        slug: 'cachet-database',
        name: 'Cachet',
        shortDescription: 'Status page for your website',
        description:
            'Cachet is a beautiful, open source status page system for your website.',
        image: image37,
        imageDark: imageDark37,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Laravel', 'PHP'],
        featured: false,
        url: 'https://github.com/cachethq/cachet',
        loadTemplate: () =>
            import('./templates/cachet-db').then((module) => module.cachetDb),
    },
    {
        slug: 'reversion-database',
        name: 'Reversion',
        shortDescription: 'Version control for model instances',
        description:
            'Django extension that provides version control for model instances, allowing you to roll back to any point in a model history and recover deleted instances.',
        image: image38,
        imageDark: imageDark38,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Python', 'Django'],
        featured: true,
        url: 'https://github.com/etianen/django-reversion',
        loadTemplate: () =>
            import('./templates/reversion-db').then(
                (module) => module.reversionDb
            ),
    },
    {
        slug: 'screeenly-database',
        name: 'Screeenly',
        shortDescription: 'Capturing high-quality website screenshots',
        description:
            'An open-source web application that provides a simple API for generating website screenshots.',
        image: image39,
        imageDark: imageDark39,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Laravel', 'PHP'],
        featured: false,
        url: 'https://github.com/stefanzweifel/screeenly',
        loadTemplate: () =>
            import('./templates/screeenly-db').then(
                (module) => module.screeenlyDb
            ),
    },
    {
        slug: 'staytus-database',
        name: 'Staytus',
        shortDescription: 'Service status publishing solution',
        description:
            'An open-source platform for publishing the status of your services, providing beautiful public and admin interfaces.',
        image: image40,
        imageDark: imageDark40,
        databaseType: DatabaseType.MYSQL,
        tags: ['MySQL', 'Open Source', 'Rails'],
        featured: true,
        url: 'https://github.com/adamcooke/staytus',
        loadTemplate: () =>
            import('./templates/staytus-db').then((module) => module.staytusDb),
    },
    {
        slug: 'deployer-database',
        name: 'Deployer',
        shortDescription: 'PHP application deployment tool',
        description: 'A free, open-source tool for deploying PHP apps via SSH.',
        image: image41,
        imageDark: imageDark41,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Laravel', 'PHP'],
        featured: false,
        url: 'https://github.com/REBELinBLUE/deployer',
        loadTemplate: () =>
            import('./templates/deployer-db').then(
                (module) => module.deployerDb
            ),
    },
    {
        slug: 'devise-database',
        name: 'Devise',
        shortDescription: 'Flexible Auth for Rails applications',
        description:
            'Flexible authentication for Rails based on Warden, MVC with 10 modules, including DB Authenticatable, Registerable, and Recoverable.',
        image: image42,
        imageDark: imageDark42,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Rails'],
        featured: true,
        url: 'https://github.com/heartcombo/devise',
        loadTemplate: () =>
            import('./templates/devise-db').then((module) => module.deviseDb),
    },
    {
        slug: 'talk-database',
        name: 'Talk',
        shortDescription: 'Real-time messaging system for Laravel apps',
        description:
            'Real-time user messaging and chatting, enabling easy integration of a complete messaging system into Laravel',
        image: image43,
        imageDark: imageDark43,
        databaseType: DatabaseType.MYSQL,
        tags: ['MySQL', 'Open Source', 'Laravel', 'PHP'],
        featured: false,
        url: 'https://github.com/nahid/talk',
        loadTemplate: () =>
            import('./templates/talk-db').then((module) => module.talkDb),
    },
    {
        slug: 'octobox-database',
        name: 'Octobox',
        shortDescription: 'GitHub notifications Manager',
        description:
            'Octobox helps you manage your GitHub notifications efficiently so you can spend less time managing and more time building.',
        image: image44,
        imageDark: imageDark44,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Rails'],
        featured: true,
        url: 'https://github.com/octobox/octobox',
        loadTemplate: () =>
            import('./templates/octobox-db').then((module) => module.octoboxDb),
    },
    {
        slug: 'pay-rails-database',
        name: 'Pay-Rails',
        shortDescription: 'Payments for Ruby on Rails apps',
        description:
            'Allows you to accept payments from Stripe, Paddle, Braintree, Lemon Squeezy, and more.',
        image: image45,
        imageDark: imageDark45,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Rails'],
        featured: true,
        url: 'https://github.com/pay-rails/pay',
        loadTemplate: () =>
            import('./templates/pay-rails-db').then(
                (module) => module.payRailsDb
            ),
    },
    {
        slug: 'laravel-activitylog-database',
        name: 'Laravel Activitylog',
        shortDescription: 'Log activity inside your Laravel app',
        description:
            'Package provides easy to use functions to log the activities of the users of your app.',
        image: image46,
        imageDark: imageDark46,
        databaseType: DatabaseType.MYSQL,
        tags: ['MySQL', 'Open Source', 'Laravel', 'PHP'],
        featured: false,
        url: 'https://github.com/stefanzweifel/laravel-activitylog',
        loadTemplate: () =>
            import('./templates/laravel-activitylog-db').then(
                (module) => module.laravelActivitylogDb
            ),
    },
    {
        slug: 'pixelfed-database',
        name: 'Pixelfed',
        shortDescription: 'Photo Sharing. For Everyone.',
        description:
            'A free and ethical photo sharing platform, powered by ActivityPub federation.',
        image: image47,
        imageDark: imageDark47,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Open Source', 'Laravel', 'PHP'],
        featured: false,
        url: 'https://github.com/pixelfed/pixelfed',
        loadTemplate: () =>
            import('./templates/pixelfed-db').then(
                (module) => module.pixelfedDb
            ),
    },
    {
        slug: 'polr-database',
        name: 'Polr',
        shortDescription: 'PHP URL shortener',
        description:
            'Self-hostable open-source link shortening web application with a robust API.',
        image: image48,
        imageDark: imageDark48,
        databaseType: DatabaseType.MYSQL,
        tags: ['MySQL', 'Open Source', 'PHP'],
        featured: false,
        url: 'https://github.com/cydrobolt/polr',
        loadTemplate: () =>
            import('./templates/polr-db').then((module) => module.polrDb),
    },
    {
        slug: 'django-axes-database',
        name: 'Django-Axes',
        shortDescription: 'Keep track of failed login attempts',
        description:
            'Plugin for keeping track of suspicious login attempts for your Django based website and implementing simple brute-force attack blocking.',
        image: image49,
        imageDark: imageDark49,
        databaseType: DatabaseType.POSTGRESQL,
        tags: ['Postgres', 'Python', 'Django'],
        featured: true,
        url: 'https://github.com/',
        loadTemplate: () =>
            import('./templates/django-axes-db').then(
                (module) => module.djangoAxesDb
            ),
    },
];

export const getTemplateManifestBySlug = (slug: string | undefined) =>
    templateManifests.find((template) => template.slug === slug);

export const loadTemplateBySlug = async (slug: string | undefined) =>
    getTemplateManifestBySlug(slug)?.loadTemplate();
