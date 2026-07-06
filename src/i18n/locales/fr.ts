import type { LanguageMetadata, LanguageTranslation } from '../types';

export const fr: LanguageTranslation = {
    translation: {
        editor_sidebar: {
            new_diagram: 'Nouveau',
            browse: 'Ouvrir',
            tables: 'Tables',
            refs: 'Refs',
            dependencies: 'Dépendances',
            custom_types: 'Types Personnalisés',
            visuals: 'Visuels',
            docs: 'Docs',
            settings: 'Settings',
        },
        menu: {
            actions: {
                actions: 'Actions',
                new: 'Nouveau...',
                browse: 'Toutes les bases de données...',
                save: 'Enregistrer',
                import: 'Importer Base de Données',
                export_sql: 'Exporter SQL',
                export_as: 'Exporter en tant que',
                delete_diagram: 'Supprimer',
            },
            edit: {
                edit: 'Édition',
                undo: 'Annuler',
                redo: 'Rétablir',
                clear: 'Effacer',
            },
            view: {
                view: 'Affichage',
                show_sidebar: 'Afficher la Barre Latérale',
                hide_sidebar: 'Cacher la Barre Latérale',
                hide_cardinality: 'Cacher la Cardinalité',
                show_cardinality: 'Afficher la Cardinalité',
                hide_field_attributes: 'Masquer les Attributs de Champ',
                show_field_attributes: 'Afficher les Attributs de Champ',
                zoom_on_scroll: 'Zoom sur le Défilement',
                show_views: 'Vues de Base de Données',
                theme: 'Thème',
                show_dependencies: 'Afficher les Dépendances',
                hide_dependencies: 'Masquer les Dépendances',
                show_minimap: 'Afficher la Mini Carte',
                hide_minimap: 'Masquer la Mini Carte',
            },
            backup: {
                backup: 'Sauvegarde',
                export_diagram: 'Exporter le diagramme',
                restore_diagram: 'Restaurer le diagramme',
            },
            help: {
                help: 'Aide',
                docs_website: 'Documentation',
                join_discord: 'Rejoignez-nous sur Discord',
            },
        },

        delete_diagram_alert: {
            title: 'Supprimer le Diagramme',
            description:
                'Cette action est irréversible. Cela supprimera définitivement le diagramme.',
            cancel: 'Annuler',
            delete: 'Supprimer',
        },

        clear_diagram_alert: {
            title: 'Effacer le Diagramme',
            description:
                'Cette action est irréversible. Cela supprimera définitivement toutes les données dans le diagramme.',
            cancel: 'Annuler',
            clear: 'Effacer',
        },

        reorder_diagram_alert: {
            title: 'Organiser Automatiquement le Diagramme',
            description:
                'Cette action réorganisera toutes les tables dans le diagramme. Voulez-vous continuer ?',
            reorder: 'Organiser Automatiquement',
            cancel: 'Annuler',
        },

        copy_to_clipboard_toast: {
            unsupported: {
                title: 'Échec de la copie',
                description: 'Presse-papiers non pris en charge',
            },
            failed: {
                title: 'Échec de la copie',
                description: 'Quelque chose a mal tourné. Veuillez réessayer.',
            },
        },

        theme: {
            system: 'Système',
            light: 'Clair',
            dark: 'Sombre',
        },

        zoom: {
            on: 'Activé',
            off: 'Désactivé',
        },

        last_saved: 'Dernière sauvegarde',
        saved: 'Enregistré',
        loading_diagram: 'Chargement du diagramme...',
        deselect_all: 'Tout désélectionner',
        select_all: 'Tout sélectionner',
        clear: 'Effacer',
        show_more: 'Afficher Plus',
        show_less: 'Afficher Moins',
        copy_to_clipboard: 'Copier dans le presse-papiers',
        copied: 'Copié !',

        side_panel: {
            view_all_options: 'Voir toutes les Options...',
            tables_section: {
                tables: 'Tables',
                add_table: 'Ajouter une Table',
                add_view: 'Ajouter une Vue',
                filter: 'Filtrer',
                collapse: 'Réduire Tout',
                clear: 'Effacer le Filtre',
                no_results:
                    'Aucune table trouvée correspondant à votre filtre.',
                show_list: 'Afficher la Liste des Tableaux',
                show_dbml: "Afficher l'éditeur DBML",
                all_hidden: 'Toutes les tables sont masquées',
                show_all: 'Tout afficher',

                table: {
                    fields: 'Champs',
                    nullable: 'Nullable?',
                    primary_key: 'Clé Primaire',
                    indexes: 'Index',
                    check_constraints: 'Contraintes de vérification',
                    comments: 'Commentaires',
                    no_comments: 'Pas de commentaires',
                    add_field: 'Ajouter un Champ',
                    add_index: 'Ajouter un Index',
                    add_check: 'Ajouter une vérification',
                    index_select_fields: 'Sélectionner des champs',
                    no_types_found: 'Aucun type trouvé',
                    field_name: 'Nom',
                    field_type: 'Type',
                    field_actions: {
                        title: 'Attributs du Champ',
                        unique: 'Unique',
                        auto_increment: 'Auto-incrément',
                        comments: 'Commentaires',
                        no_comments: 'Pas de commentaires',
                        delete_field: 'Supprimer le Champ',
                        default_value: 'Default Value',
                        no_default: 'No default',
                        character_length: 'Max Length',
                        precision: 'Précision',
                        scale: 'Échelle',
                    },
                    index_actions: {
                        title: "Attributs de l'Index",
                        name: 'Nom',
                        unique: 'Unique',
                        index_type: "Type d'index",
                        delete_index: "Supprimer l'Index",
                    },
                    check_constraint_actions: {
                        title: 'Contrainte de vérification',
                        expression: 'Expression',
                        delete: 'Supprimer la contrainte',
                    },
                    table_actions: {
                        title: 'Actions de la Table',
                        add_field: 'Ajouter un Champ',
                        add_index: 'Ajouter un Index',
                        duplicate_table: 'Tableau dupliqué',
                        delete_table: 'Supprimer la Table',
                        change_schema: 'Changer le Schéma',
                    },
                },
                empty_state: {
                    title: 'Aucune table',
                    description: 'Créez une table pour commencer',
                },
            },
            refs_section: {
                refs: 'Refs',
                filter: 'Filtrer',
                collapse: 'Réduire Tout',
                add_relationship: 'Ajouter une Relation',
                relationships: 'Relations',
                dependencies: 'Dépendances',
                relationship: {
                    relationship: 'Relation',
                    primary: 'Table Principale',
                    foreign: 'Table Liée',
                    cardinality: 'Cardinalité',
                    delete_relationship: 'Supprimer',
                    switch_tables: 'Inverser les tables',
                    relationship_actions: {
                        title: 'Actions',
                        delete_relationship: 'Supprimer',
                    },
                },
                dependency: {
                    dependency: 'Dépendance',
                    table: 'Table',
                    dependent_table: 'Vue Dépendante',
                    delete_dependency: 'Supprimer',
                    dependency_actions: {
                        title: 'Actions',
                        delete_dependency: 'Supprimer',
                    },
                },
                empty_state: {
                    title: 'Aucune relation',
                    description: 'Créez une relation pour commencer',
                },
            },

            areas_section: {
                areas: 'Zones',
                add_area: 'Ajouter une Zone',
                filter: 'Filtrer',
                clear: 'Effacer le Filtre',
                no_results: 'Aucune zone trouvée correspondant à votre filtre.',

                area: {
                    area_actions: {
                        title: 'Actions de la Zone',
                        edit_name: 'Modifier le Nom',
                        delete_area: 'Supprimer la Zone',
                    },
                },
                empty_state: {
                    title: 'Aucune zone',
                    description: 'Créez une zone pour commencer',
                },
            },

            visuals_section: {
                visuals: 'Visuels',
                tabs: {
                    areas: 'Zones',
                    notes: 'Notes',
                },
            },

            notes_section: {
                filter: 'Filtrer',
                add_note: 'Ajouter une Note',
                no_results: 'Aucune note trouvée',
                clear: 'Effacer le Filtre',
                empty_state: {
                    title: 'Pas de Notes',
                    description:
                        'Créez une note pour ajouter des annotations de texte sur le canevas',
                },
                note: {
                    empty_note: 'Note vide',
                    note_actions: {
                        title: 'Actions de Note',
                        edit_content: 'Modifier le Contenu',
                        delete_note: 'Supprimer la Note',
                    },
                },
            },

            custom_types_section: {
                custom_types: 'Types Personnalisés',
                filter: 'Filtrer',
                clear: 'Effacer le Filtre',
                no_results:
                    'Aucun type personnalisé trouvé correspondant à votre filtre.',
                new_type: 'Nouveau Type',
                empty_state: {
                    title: 'Aucun type personnalisé',
                    description:
                        "Les types personnalisés apparaîtront ici lorsqu'ils seront disponibles dans votre base de données",
                },
                custom_type: {
                    kind: 'Type',
                    enum_values: 'Valeurs Enum',
                    composite_fields: 'Champs',
                    no_fields: 'Aucun champ défini',
                    no_values: "Aucune valeur d'énumération définie",
                    field_name_placeholder: 'Nom du champ',
                    field_type_placeholder: 'Sélectionner le type',
                    add_field: 'Ajouter un Champ',
                    no_fields_tooltip:
                        'Aucun champ défini pour ce type personnalisé',
                    custom_type_actions: {
                        title: 'Actions',
                        highlight_fields: 'Surligner les Champs',
                        delete_custom_type: 'Supprimer',
                        clear_field_highlight: 'Effacer le Surlignage',
                    },
                    delete_custom_type: 'Supprimer le Type',
                },
            },
        },

        toolbar: {
            zoom_in: 'Zoom Avant',
            zoom_out: 'Zoom Arrière',
            save: 'Enregistrer',
            show_all: 'Afficher Tout',
            undo: 'Annuler',
            redo: 'Rétablir',
            reorder_diagram: 'Organiser Automatiquement le Diagramme',
            clear_custom_type_highlight: 'Clear highlight for "{{typeName}}"',
            custom_type_highlight_tooltip:
                'Highlighting "{{typeName}}" - Click to clear',
            highlight_overlapping_tables: 'Surligner les tables chevauchées',
            filter: 'Filtrer les Tables',
        },

        new_diagram_dialog: {
            database_selection: {
                title: 'Quelle est votre Base de Données ?',
                description:
                    'Chaque base de données a ses propres fonctionnalités et capacités uniques.',
                check_examples_long: 'Voir les Exemples',
                check_examples_short: 'Exemples',
            },

            import_database: {
                title: 'Importer votre Base de Données',
                database_edition: 'Édition de la Base de Données :',
                step_1: 'Exécutez ce script dans votre base de données :',
                step_2: 'Collez le résultat du script ici →',
                script_results_placeholder: 'Résultats du script ici...',
                ssms_instructions: {
                    button_text: 'Instructions SSMS',
                    title: 'Instructions',
                    step_1: 'Allez dans Outils > Options > Résultats des Requêtes > SQL Server.',
                    step_2: 'Si vous utilisez "Résultats en Grille", changez le nombre maximum de caractères récupérés pour les données non-XML (définir à 9999999).',
                },
                instructions_link: "Besoin d'aide ? Regardez comment",
                check_script_result: 'Vérifier le résultat du Script',
            },

            cancel: 'Annuler',
            back: 'Retour',
            import_from_file: "Importer à partir d'un fichier",
            empty_diagram: 'Base de données vide',
            continue: 'Continuer',
            import: 'Importer',
        },

        open_diagram_dialog: {
            title: 'Ouvrir Base de Données',
            description:
                'Sélectionnez un diagramme à ouvrir dans la liste ci-dessous.',
            table_columns: {
                name: 'Nom',
                created_at: 'Créé le',
                last_modified: 'Dernière modification',
                tables_count: 'Tables',
            },
            cancel: 'Annuler',
            open: 'Ouvrir',
            new_database: 'Nouvelle Base de Données',

            diagram_actions: {
                open: 'Ouvrir',
                duplicate: 'Dupliquer',
                delete: 'Supprimer',
            },
        },

        export_sql_dialog: {
            title: 'Exporter SQL',
            description:
                'Exportez le schéma de votre diagramme en script {{databaseType}}',
            close: 'Fermer',
            mode: {
                deterministic: 'Deterministic',
                ai: 'AI',
            },
            loading: {
                text: "L'IA génère un SQL pour {{databaseType}}...",
                description: "Cela devrait prendre jusqu'à 30 secondes.",
            },
            error: {
                message:
                    'Erreur lors de la génération du script SQL. Veuillez réessayer plus tard ou <0>contactez-nous</0>.',
                description:
                    "N'hésitez pas à utiliser votre OPENAI_TOKEN, voir le manuel <0>ici</0>.",
            },
        },

        smart_query_wizard: {
            title: 'Smart Query Wizard',
            description:
                'SchemaFlow never asks for your database password. You copy a read-only metadata query, run it locally, then paste the JSON output here.',
            steps: {
                choose_database: {
                    title: 'Choose this database type',
                    description:
                        'The query is generated for the selected database and client.',
                },
                copy_query: {
                    title: 'Copy the Smart Query',
                    description:
                        'Run it in your own database client. No database password is required in SchemaFlow.',
                },
                paste_json: {
                    title: 'Paste the JSON result',
                    description:
                        'Only paste the metadata JSON returned by the query, not a connection string or secret.',
                },
                preview: {
                    title: 'Preview tables, relationships, and warnings',
                    description:
                        'SchemaFlow summarizes objects and dialect limitations before writing to the diagram.',
                },
                confirm: {
                    title: 'Confirm import',
                    description:
                        'Nothing is added to IndexedDB until you confirm the preview.',
                },
            },
        },

        export_image_dialog: {
            title: "Exporter l'image",
            description:
                "Choisissez le facteur d'échelle pour l'image exportée.",
            scale_1x: '1x (Basse qualité)',
            scale_2x: '2x (Qualité normale)',
            scale_4x: '4x (Meilleure qualité)',
            cancel: 'Annuler',
            export: 'Exporter',
            advanced_options: 'Advanced Options',
            pattern: 'Include background pattern',
            pattern_description: 'Add subtle grid pattern to background.',
            transparent: 'Transparent background',
            transparent_description: 'Remove background color from image.',
        },

        new_table_schema_dialog: {
            title: 'Sélectionner un Schéma',
            description:
                'Plusieurs schémas sont actuellement affichés. Sélectionnez-en un pour la nouvelle table.',
            cancel: 'Annuler',
            confirm: 'Confirmer',
        },

        star_us_dialog: {
            title: 'Aidez-nous à nous améliorer',
            description:
                "Souhaitez-vous nous donner une étoile sur GitHub ? Il ne suffit que d'un clic !",
            close: 'Pas maintenant',
            confirm: 'Bien sûr !',
        },

        update_table_schema_dialog: {
            title: 'Modifier le Schéma',
            description: 'Mettre à jour le schéma de la table "{{tableName}}"',
            cancel: 'Annuler',
            confirm: 'Modifier',
        },
        create_table_schema_dialog: {
            title: 'Créer un Nouveau Schéma',
            description:
                "Aucun schéma n'existe encore. Créez votre premier schéma pour organiser vos tables.",
            create: 'Créer',
            cancel: 'Annuler',
        },

        create_relationship_dialog: {
            title: 'Créer une Relation',
            primary_table: 'Table Principale',
            primary_field: 'Champ Principal',
            referenced_table: 'Table Référencée',
            referenced_field: 'Champ Référencé',
            primary_table_placeholder: 'Sélectionner une table',
            primary_field_placeholder: 'Sélectionner un champ',
            referenced_table_placeholder: 'Sélectionner une table',
            referenced_field_placeholder: 'Sélectionner un champ',
            no_tables_found: 'Aucune table trouvée',
            no_fields_found: 'Aucun champ trouvé',
            create: 'Créer',
            cancel: 'Annuler',
        },

        import_database_dialog: {
            title: 'Importer dans le Diagramme Actuel',
            override_alert: {
                title: 'Importer Base de Données',
                content: {
                    alert: "L'importation de ce diagramme affectera les tables et relations existantes.",
                    new_tables:
                        '<bold>{{newTablesNumber}}</bold> nouvelles tables seront ajoutées.',
                    new_relationships:
                        '<bold>{{newRelationshipsNumber}}</bold> nouvelles relations seront créées.',
                    tables_override:
                        '<bold>{{tablesOverrideNumber}}</bold> tables seront écrasées.',
                    proceed: 'Voulez-vous continuer ?',
                },
                import: 'Importer',
                cancel: 'Annuler',
            },
        },
        export_diagram_dialog: {
            title: 'Exporter le Diagramme',
            description: "Sélectionner le format d'exportation :",
            format_json: 'JSON',
            cancel: 'Annuler',
            export: 'Exporter',
            error: {
                title: "Erreur lors de l'exportation du diagramme",
                description:
                    "Une erreur s'est produite. Besoin d'aide ? https://github.com/Lynn-Lee/SchemaFlow/issues",
            },
        },
        import_diagram_dialog: {
            title: 'Importer un diagramme',
            description: 'Coller le diagramme au format JSON ci-dessous :',
            cancel: 'Annuler',
            import: 'Exporter',
            error: {
                title: "Erreur lors de l'exportation du diagramme",
                description:
                    "Le diagramme JSON n'est pas valide. Veuillez vérifier le JSON et réessayer. Besoin d'aide ? https://github.com/Lynn-Lee/SchemaFlow/issues",
            },
        },
        import_dbml_dialog: {
            example_title: "Exemple d'importation DBML",
            title: 'Import DBML',
            description:
                'Importer un schéma de base de données à partir du format DBML.',
            import: 'Importer',
            cancel: 'Annuler',
            skip_and_empty: 'Passer et vider',
            show_example: 'Afficher un exemple',
            error: {
                title: 'Erreur',
                description:
                    "Erreur d'analyse du DBML. Veuillez vérifier la syntaxe.",
            },
        },
        relationship_type: {
            one_to_one: 'Un à Un',
            one_to_many: 'Un à Plusieurs',
            many_to_one: 'Plusieurs à Un',
            many_to_many: 'Plusieurs à Plusieurs',
        },

        canvas_context_menu: {
            new_table: 'Nouvelle Table',
            new_view: 'Nouvelle Vue',
            new_relationship: 'Nouvelle Relation',
            new_area: 'Nouvelle Zone',
            new_note: 'Nouvelle Note',
        },

        table_node_context_menu: {
            edit_table: 'Éditer la Table',
            duplicate_table: 'Tableau Dupliqué',
            delete_table: 'Supprimer la Table',
            add_relationship: 'Ajouter une Relation',
            move_to_area: 'Déplacer vers une Zone',
            no_area: 'Aucune Zone',
        },

        templates_page: {
            heading_featured: 'Featured database schema templates',
            heading_tagged: 'Database schema templates for {{tag}}',
            heading_all: 'Database schema templates',
            description:
                'Discover a collection of real-world database schema diagrams, featuring example applications and popular open-source projects.',
            description_tagged:
                'Discover a collection of real-world database schema diagrams for {{tag}}, featuring example applications and popular open-source projects.',
            navigation: {
                featured: 'Featured',
                all_templates: 'All Templates',
                tags: 'Tags',
            },
        },

        canvas: {
            all_tables_hidden: 'Toutes les tables sont masquées',
            show_all_tables: 'Tout afficher',
            mobile_notice: {
                title: 'Mobile editing is limited',
                description:
                    'For reliable canvas editing, use a desktop browser. You can continue on this device.',
                dismiss: 'Dismiss mobile canvas notice',
            },
        },

        canvas_filter: {
            title: 'Filtrer les Tables',
            search_placeholder: 'Rechercher des tables...',
            group_by_schema: 'Grouper par Schéma',
            group_by_area: 'Grouper par Zone',
            no_tables_found: 'Aucune table trouvée',
            empty_diagram_description: 'Créez une table pour commencer',
            no_tables_description:
                'Essayez de modifier votre recherche ou filtre',
            clear_filter: 'Effacer le filtre',
        },

        snap_to_grid_tooltip:
            'Aligner sur la grille (maintenir la touche {{key}})',

        tool_tips: {
            double_click_to_edit: 'Double-cliquez pour modifier',
        },

        language_select: {
            change_language: 'Langue',
        },

        on: 'Activé',
        off: 'Désactivé',

        settings: {
            dialog: {
                title: 'Settings',
                description:
                    'Manage local editor preferences, AI export mode, and browser-stored diagram data.',
            },
            display: {
                heading: 'Display',
                description: 'Keep editor preferences in this browser.',
                theme: 'Theme',
                theme_system: 'System',
                theme_light: 'Light',
                theme_dark: 'Dark',
                language: 'Language',
                show_minimap: 'Show mini map',
                show_field_attributes: 'Show field attributes',
                scroll_action: 'Canvas scroll action',
                scroll_action_pan: 'Pan canvas',
                scroll_action_zoom: 'Zoom canvas',
            },
            privacy: {
                session_only_title: 'Session-only settings',
                session_only_description:
                    'Browser settings are unavailable. Changes work for this session only.',
                ai_mode_heading: 'AI mode',
                ai_mode_description:
                    'Control whether SQL export can use AI assistance.',
                ai_export_mode_label: 'AI-assisted export mode',
                ai_export_mode_disabled: 'Disabled',
                ai_export_mode_byok: 'BYOK session',
                ai_export_mode_gateway: 'Self-hosted gateway',
                byok_alert_title: 'Session-only BYOK',
                byok_alert_line_1: 'Paste the API key only when exporting SQL.',
                byok_alert_line_2:
                    'BYOK keys are session-only and are never saved.',
                byok_never_saved:
                    'BYOK keys are session-only and are never saved.',
                byok_session_key_label: 'Session API key',
                byok_session_key_hint:
                    'Stored in memory only. Refreshing the page clears this key.',
                gateway_endpoint_label: 'Gateway endpoint',
                gateway_model_label: 'Model name',
                gateway_model_placeholder: 'Optional',
                data_management_heading: 'Data management',
                data_management_description:
                    'SchemaFlow stores diagrams in this browser with IndexedDB and localStorage. No account or cloud workspace is required.',
                export_backup_button: 'Export diagram backup',
                restore_backup_button: 'Restore from backup',
                backup_file_label: 'Backup file',
                clear_local_diagrams_button: 'Clear local diagrams',
                reading_backup_title: 'Reading backup',
                reading_backup_description:
                    'SchemaFlow is building a restore preview.',
                backup_restored_title: 'Backup restored',
                backup_restored_description:
                    'The selected backup has been restored as local diagram data.',
                restore_failed_title: 'Could not restore backup',
                restore_failed_default: 'Backup file could not be restored.',
                preview_failed_default: 'Backup file could not be previewed.',
                read_failed_default: 'Backup file could not be read.',
                cleared_title: 'Local diagrams cleared',
                cleared_description: 'All local diagrams have been deleted.',
                clear_failed_title: 'Could not clear local diagrams',
                clear_failed_default: 'Local diagrams could not be deleted.',
                clear_dialog_title: 'Delete all local diagrams?',
                clear_dialog_description:
                    'This deletes every diagram stored in this browser, including tables, relationships, notes, areas, custom types, and filters. Export a backup first if you need to keep a copy.',
                cancel: 'Cancel',
                deleting: 'Deleting...',
                delete_local_diagrams: 'Delete local diagrams',
                restore_dialog_title: 'Restore backup preview?',
                restore_dialog_description:
                    'Review the diagrams in this backup before restoring them into local browser storage.',
                diagram_singular: '{{count}} diagram in this backup.',
                diagram_plural: '{{count}} diagrams in this backup.',
                table_singular: '{{count}} table',
                table_plural: '{{count}} tables',
                relationship_singular: '{{count}} relationship',
                relationship_plural: '{{count}} relationships',
                restoring: 'Restoring...',
                restore_backup_action: 'Restore backup',
            },
            keyboard: {
                heading: 'Keyboard shortcuts',
                description:
                    'Core editor paths remain available without pointer-only controls.',
                undo: 'Undo diagram change',
                redo: 'Redo diagram change',
                command_actions: 'Open command actions',
                zoom_canvas: 'Zoom canvas',
                zoom_canvas_keys: 'Mouse wheel or toolbar controls',
            },
        },

        onboarding: {
            title: 'Start a SchemaFlow diagram',
            description:
                'Pick the database first, then choose whether to import, start blank, or explore templates.',
            database_heading: 'Database',
            start_option_heading: 'Start option',
            start_options: {
                import: {
                    title: 'Import existing database',
                    description:
                        'Start from SQL, DBML, or metadata and review it before saving.',
                },
                blank: {
                    title: 'New blank diagram',
                    description:
                        'Create an empty local diagram for manual modeling.',
                },
                template: {
                    title: 'Browse templates',
                    description:
                        'Open a realistic example and clone it into your workspace.',
                },
            },
            no_database_selected: 'No database selected',
            selected_label: 'Selected: {{label}}',
            choose_database_error:
                'Choose a database before creating or importing a diagram.',
            choose_start_option_error: 'Choose how you want to start.',
            create_failed_error:
                'SchemaFlow could not create the diagram. Nothing was saved; try again.',
            import_json_backup: 'Import JSON backup',
            continue: 'Continue',
            creating: 'Creating...',
        },
    },
};

export const frMetadata: LanguageMetadata = {
    name: 'French',
    nativeName: 'Français',
    code: 'fr',
};
