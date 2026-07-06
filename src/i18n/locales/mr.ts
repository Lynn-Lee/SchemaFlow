import type { LanguageMetadata, LanguageTranslation } from '../types';

export const mr: LanguageTranslation = {
    translation: {
        editor_sidebar: {
            new_diagram: 'नवीन',
            browse: 'उघडा',
            tables: 'टेबल',
            refs: 'Refs',
            dependencies: 'अवलंबने',
            custom_types: 'कस्टम प्रकार',
            visuals: 'Visuals',
            docs: 'Docs',
            settings: 'Settings',
        },
        menu: {
            actions: {
                actions: 'क्रिया',
                new: 'नवीन...',
                browse: 'सर्व डेटाबेस...',
                save: 'जतन करा',
                import: 'डेटाबेस इम्पोर्ट करा',
                export_sql: 'SQL एक्स्पोर्ट करा',
                export_as: 'म्हणून एक्स्पोर्ट करा',
                delete_diagram: 'हटवा',
            },
            edit: {
                edit: 'संपादन करा',
                undo: 'पूर्ववत करा',
                redo: 'पुन्हा करा',
                clear: 'साफ करा',
            },
            view: {
                view: 'दृश्य',
                show_sidebar: 'साइडबार दाखवा',
                hide_sidebar: 'साइडबार लपवा',
                hide_cardinality: 'कार्डिनॅलिटी लपवा',
                show_cardinality: 'कार्डिनॅलिटी दाखवा',
                hide_field_attributes: 'फील्ड गुणधर्म लपवा',
                show_field_attributes: 'फील्ड गुणधर्म दाखवा',
                zoom_on_scroll: 'स्क्रोलवर झूम करा',
                show_views: 'डेटाबेस व्ह्यूज',
                theme: 'थीम',
                show_dependencies: 'डिपेंडेन्सि दाखवा',
                hide_dependencies: 'डिपेंडेन्सि लपवा',
                show_minimap: 'Show Mini Map',
                hide_minimap: 'Hide Mini Map',
            },
            backup: {
                backup: 'Backup',
                export_diagram: 'Export Diagram',
                restore_diagram: 'Restore Diagram',
            },
            help: {
                help: 'मदत',
                docs_website: 'दस्तऐवजीकरण',
            },
        },

        delete_diagram_alert: {
            title: 'आरेख हटवा',
            description:
                'ही क्रिया पूर्ववत केली जाऊ शकत नाही. हे आरेख कायमचे हटवेल.',
            cancel: 'रद्द करा',
            delete: 'हटवा',
        },

        clear_diagram_alert: {
            title: 'आरेख साफ करा',
            description:
                'ही क्रिया पूर्ववत केली जाऊ शकत नाही. हे आरेखातील सर्व डेटा कायमचे हटवेल.',
            cancel: 'रद्द करा',
            clear: 'साफ करा',
        },

        reorder_diagram_alert: {
            title: 'आरेख स्वयंचलित व्यवस्थित करा',
            description:
                'ही क्रिया आरेखातील सर्व टेबल्सची पुनर्रचना करेल. तुम्हाला पुढे जायचे आहे का?',
            reorder: 'स्वयंचलित व्यवस्थित करा',
            cancel: 'रद्द करा',
        },

        copy_to_clipboard_toast: {
            unsupported: {
                title: 'कॉपी अयशस्वी',
                description: 'क्लिपबोर्ड समर्थित नाही',
            },
            failed: {
                title: 'कॉपी अयशस्वी',
                description: 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.',
            },
        },

        theme: {
            system: 'सिस्टम',
            light: 'लाईट',
            dark: 'डार्क',
        },

        zoom: {
            on: 'चालू',
            off: 'बंद',
        },

        last_saved: 'शेवटचे जतन केले',
        saved: 'जतन केले',
        loading_diagram: 'आरेख लोड करत आहे...',
        deselect_all: 'सर्व निवड रद्द करा',
        select_all: 'सर्व निवडा',
        clear: 'साफ करा',
        show_more: 'अधिक दाखवा',
        show_less: 'कमी दाखवा',
        copy_to_clipboard: 'Copy to Clipboard',
        copied: 'Copied!',

        side_panel: {
            view_all_options: 'सर्व पर्याय पहा...',
            tables_section: {
                tables: 'टेबल्स',
                add_table: 'टेबल जोडा',
                add_view: 'व्ह्यू जोडा',
                filter: 'फिल्टर',
                collapse: 'सर्व संकुचित करा',
                clear: 'Clear Filter',
                no_results: 'No tables found matching your filter.',
                show_list: 'Show Table List',
                show_dbml: 'Show DBML Editor',
                all_hidden: 'सर्व टेबल्स लपवलेले आहेत',
                show_all: 'सर्व दाखवा',

                table: {
                    fields: 'फील्ड्स',
                    nullable: 'नल करण्यायोग्य?',
                    primary_key: 'प्राथमिक की',
                    indexes: 'सूचकांक',
                    check_constraints: 'तपासणी निर्बंध',
                    comments: 'टिप्पण्या',
                    no_comments: 'कोणत्याही टिप्पणी नाहीत',
                    add_field: 'फील्ड जोडा',
                    add_index: 'सूचकांक जोडा',
                    add_check: 'तपासणी जोडा',
                    index_select_fields: 'फील्ड निवडा',
                    no_types_found: 'कोणतेही प्रकार सापडले नाहीत',
                    field_name: 'नाव',
                    field_type: 'प्रकार',
                    field_actions: {
                        title: 'फील्ड गुणधर्म',
                        unique: 'युनिक',
                        auto_increment: 'ऑटो इंक्रिमेंट',
                        comments: 'टिप्पण्या',
                        no_comments: 'कोणत्याही टिप्पणी नाहीत',
                        delete_field: 'फील्ड हटवा',
                        default_value: 'Default Value',
                        no_default: 'No default',
                        character_length: 'Max Length',
                        precision: 'अचूकता',
                        scale: 'प्रमाण',
                    },
                    index_actions: {
                        title: 'इंडेक्स गुणधर्म',
                        name: 'नाव',
                        unique: 'युनिक',
                        index_type: 'इंडेक्स प्रकार',
                        delete_index: 'इंडेक्स हटवा',
                    },
                    check_constraint_actions: {
                        title: 'तपासणी निर्बंध',
                        expression: 'अभिव्यक्ती',
                        delete: 'निर्बंध हटवा',
                    },
                    table_actions: {
                        title: 'टेबल एक्शन',
                        change_schema: 'स्कीमा बदला',
                        add_field: 'फील्ड जोडा',
                        add_index: 'इंडेक्स जोडा',
                        delete_table: 'टेबल हटवा',
                        duplicate_table: 'Duplicate Table',
                    },
                },
                empty_state: {
                    title: 'कोणतेही टेबल नाहीत',
                    description: 'सुरू करण्यासाठी एक टेबल तयार करा',
                },
            },
            refs_section: {
                refs: 'Refs',
                filter: 'फिल्टर',
                collapse: 'सर्व संकुचित करा',
                add_relationship: 'रिलेशनशिप जोडा',
                relationships: 'रिलेशनशिप',
                dependencies: 'डिपेंडेन्सि',
                relationship: {
                    relationship: 'रिलेशनशिप',
                    primary: 'प्राथमिक टेबल',
                    foreign: 'संबंधित टेबल',
                    cardinality: 'कार्डिनॅलिटी',
                    delete_relationship: 'हटवा',
                    switch_tables: 'टेबल बदला',
                    relationship_actions: {
                        title: 'क्रिया',
                        delete_relationship: 'हटवा',
                    },
                },
                dependency: {
                    dependency: 'डिपेंडेन्सि',
                    table: 'टेबल',
                    dependent_table: 'डिपेंडेन्सि दृश्य',
                    delete_dependency: 'हटवा',
                    dependency_actions: {
                        title: 'क्रिया',
                        delete_dependency: 'हटवा',
                    },
                },
                empty_state: {
                    title: 'कोणतेही रिलेशनशिप नाहीत',
                    description: 'सुरू करण्यासाठी एक रिलेशनशिप तयार करा',
                },
            },

            areas_section: {
                areas: 'क्षेत्रे',
                add_area: 'क्षेत्र जोडा',
                filter: 'फिल्टर',
                clear: 'फिल्टर साफ करा',
                no_results:
                    'तुमच्या फिल्टरशी जुळणारे कोणतेही क्षेत्र सापडले नाही।',

                area: {
                    area_actions: {
                        title: 'क्षेत्र क्रिया',
                        edit_name: 'नाव संपादित करा',
                        delete_area: 'क्षेत्र हटवा',
                    },
                },
                empty_state: {
                    title: 'क्षेत्रे नाहीत',
                    description: 'सुरू करण्यासाठी क्षेत्र तयार करा',
                },
            },

            visuals_section: {
                visuals: 'Visuals',
                tabs: {
                    areas: 'क्षेत्रे',
                    notes: 'नोट्स',
                },
            },

            notes_section: {
                filter: 'फिल्टर',
                add_note: 'नोट जोडा',
                no_results: 'कोणत्याही नोट्स सापडल्या नाहीत',
                clear: 'फिल्टर साफ करा',
                empty_state: {
                    title: 'नोट्स नाहीत',
                    description:
                        'कॅनव्हासवर मजकूर भाष्य जोडण्यासाठी एक नोट तयार करा',
                },
                note: {
                    empty_note: 'रिकामी नोट',
                    note_actions: {
                        title: 'नोट क्रिया',
                        edit_content: 'सामग्री संपादित करा',
                        delete_note: 'नोट हटवा',
                    },
                },
            },

            custom_types_section: {
                custom_types: 'कस्टम प्रकार',
                filter: 'फिल्टर',
                clear: 'फिल्टर साफ करा',
                no_results:
                    'तुमच्या फिल्टरशी जुळणारा कोणताही कस्टम प्रकार सापडला नाही.',
                new_type: 'नवीन प्रकार',
                empty_state: {
                    title: 'कस्टम प्रकार नाहीत',
                    description:
                        'तुमच्या डेटाबेसमध्ये उपलब्ध असताना कस्टम प्रकार येथे दिसतील',
                },
                custom_type: {
                    kind: 'प्रकार',
                    enum_values: 'Enum मूल्ये',
                    composite_fields: 'फील्ड्स',
                    no_fields: 'कोणतेही फील्ड परिभाषित नाहीत',
                    no_values: 'कोणतीही enum मूल्ये परिभाषित नाहीत',
                    field_name_placeholder: 'फील्डचे नाव',
                    field_type_placeholder: 'प्रकार निवडा',
                    add_field: 'फील्ड जोडा',
                    no_fields_tooltip:
                        'या कस्टम प्रकारासाठी कोणतेही फील्ड परिभाषित नाहीत',
                    custom_type_actions: {
                        title: 'क्रिया',
                        highlight_fields: 'फील्ड्स हायलाइट करा',
                        delete_custom_type: 'हटवा',
                        clear_field_highlight: 'हायलाइट काढा',
                    },
                    delete_custom_type: 'प्रकार हटवा',
                },
            },
        },

        toolbar: {
            zoom_in: 'झूम इन',
            zoom_out: 'झूम आउट',
            save: 'जतन करा',
            show_all: 'सर्व दाखवा',
            undo: 'पूर्ववत करा',
            redo: 'पुन्हा करा',
            reorder_diagram: 'आरेख स्वयंचलित व्यवस्थित करा',
            clear_custom_type_highlight: 'Clear highlight for "{{typeName}}"',
            custom_type_highlight_tooltip:
                'Highlighting "{{typeName}}" - Click to clear',
            highlight_overlapping_tables: 'ओव्हरलॅपिंग टेबल्स हायलाइट करा',
            filter: 'टेबल्स फिल्टर करा',
        },

        new_diagram_dialog: {
            database_selection: {
                title: 'तुमचा डेटाबेस कोणता आहे?',
                description:
                    'प्रत्येक डेटाबेसचे स्वतःचे युनिक वैशिष्ट्ये आणि क्षमता आहेत.',
                transactional: 'Transactional',
                analytical: 'Analytical',
                more_databases: 'More Databases',
                primary_databases: 'Primary Databases',
                check_examples_long: 'उदाहरणे तपासा',
                check_examples_short: 'उदाहरणे',
            },

            import_database: {
                title: 'तुमचा डेटाबेस आयात करा',
                database_edition: 'डेटाबेस संस्करण:',
                step_1: 'तुमच्या डेटाबेसमध्ये हा स्क्रिप्ट चालवा:',
                step_2: 'स्क्रिप्टचा परिणाम येथे पेस्ट करा →',
                script_results_placeholder: 'स्क्रिप्ट परिणाम येथे...',
                ssms_instructions: {
                    button_text: 'SSMS सूचना',
                    title: 'सूचना',
                    step_1: 'टूल्स > पर्याय > क्वेरी परिणाम > SQL सर्व्हर वर जा.',
                    step_2: 'जर तुम्ही "ग्रिडला परिणाम" वापरत असाल, तर नॉन-XML डेटासाठी जास्तीत जास्त वर्ण पुनर्प्राप्ती बदला (9999999 वर सेट करा).',
                },
                instructions_link: 'Need help? Watch how',
                check_script_result: 'Check Script Result',
            },

            cancel: 'रद्द करा',
            import_from_file: 'Import from File',
            back: 'मागे',
            empty_diagram: 'रिक्त डेटाबेस',
            continue: 'सुरू ठेवा',
            import: 'आयात करा',
        },

        open_diagram_dialog: {
            title: 'डेटाबेस उघडा',
            description: 'खालील यादीतून उघडण्यासाठी एक आरेख निवडा.',
            table_columns: {
                name: 'नाव',
                created_at: 'तयार केले',
                last_modified: 'शेवटचे बदलले',
                tables_count: 'टेबल्स',
            },
            cancel: 'रद्द करा',
            open: 'उघडा',
            new_database: 'नवीन डेटाबेस',
            load_error: {
                title: 'Could not load local diagrams',
                description:
                    'Local diagrams could not be read. Check browser storage permissions or create a new database.',
                retry: 'Retry loading diagrams',
            },

            diagram_actions: {
                open: 'उघडा',
                duplicate: 'डुप्लिकेट',
                delete: 'हटवा',
            },
        },

        export_sql_dialog: {
            title: 'SQL निर्यात करा',
            description:
                'तुमच्या आरेख स्कीमाला {{databaseType}} स्क्रिप्टमध्ये निर्यात करा',
            close: 'बंद करा',
            mode: {
                deterministic: 'Deterministic',
                ai: 'AI',
            },
            loading: {
                text: 'AI {{databaseType}} साठी SQL तयार करत आहे...',
                description: 'याला 30 सेकंद लागतील.',
            },
            error: {
                message:
                    'SQL स्क्रिप्ट तयार करताना एरर. कृपया नंतर पुन्हा प्रयत्न करा किंवा <0>आमच्याशी संपर्क साधा</0>.',
                description:
                    'तुमचा OPENAI_TOKEN वापरण्यास मोकळे रहा, मॅन्युअल <0>येथे</0> पहा.',
            },
        },

        create_relationship_dialog: {
            title: 'रिलेशनशिप तयार करा',
            primary_table: 'प्राथमिक टेबल',
            primary_field: 'रेफरन्स फील्ड',
            referenced_table: 'रेफरन्स टेबल',
            referenced_field: 'रेफरन्स फील्ड',
            primary_table_placeholder: 'टेबल निवडा',
            primary_field_placeholder: 'फील्ड निवडा',
            referenced_table_placeholder: 'टेबल निवडा',
            referenced_field_placeholder: 'फील्ड निवडा',
            no_tables_found: 'कोणतेही टेबल सापडले नाहीत',
            no_fields_found: 'कोणतेही फील्ड सापडले नाहीत',
            create: 'तयार करा',
            cancel: 'रद्द करा',
        },

        import_database_dialog: {
            title: 'सध्याच्या आरेखात आयात करा',
            override_alert: {
                title: 'डेटाबेस आयात करा',
                content: {
                    alert: 'हा आरेख आयात केल्याने सध्याचे टेबल्स आणि रिलेशनशिप वर फरक पडेल.',
                    new_tables:
                        '<bold>{{newTablesNumber}}</bold> नवीन टेबल्स जोडले जातील.',
                    new_relationships:
                        '<bold>{{newRelationshipsNumber}}</bold> नवीन रिलेशनशिप तयार केले जातील.',
                    tables_override:
                        '<bold>{{tablesOverrideNumber}}</bold> टेबल्स अधिलिखित केले जातील.',
                    proceed: 'तुम्हाला पुढे जायचे आहे का?',
                },
                import: 'आयात करा',
                cancel: 'रद्द करा',
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
            title: 'इमेज निर्यात करा',
            description: 'एक्स्पोर्ट करण्यासाठी स्केल फॅक्टर निवडा:',
            scale_1x: '1x (कमी गुणवत्ता)',
            scale_2x: '2x (सामान्य गुणवत्ता)',
            scale_4x: '4x (सर्वोत्तम गुणवत्ता)',
            cancel: 'रद्द करा',
            export: 'निर्यात करा',
            advanced_options: 'Advanced Options',
            pattern: 'Include background pattern',
            pattern_description: 'Add subtle grid pattern to background.',
            transparent: 'Transparent background',
            transparent_description: 'Remove background color from image.',
        },

        new_table_schema_dialog: {
            title: 'स्कीमा निवडा',
            description:
                'सध्या एकाधिक स्कीमा प्रदर्शित आहेत. नवीन टेबलसाठी एक निवडा.',
            cancel: 'रद्द करा',
            confirm: 'पुष्टी करा',
        },

        update_table_schema_dialog: {
            title: 'स्कीमा बदला',
            description: 'टेबल "{{tableName}}" स्कीमा अपडेट करा',
            cancel: 'रद्द करा',
            confirm: 'बदला',
        },

        create_table_schema_dialog: {
            title: 'नवीन स्कीमा तयार करा',
            description:
                'अजून कोणतीही स्कीमा अस्तित्वात नाही. आपल्या टेबल्स व्यवस्थित करण्यासाठी आपली पहिली स्कीमा तयार करा.',
            create: 'तयार करा',
            cancel: 'रद्द करा',
        },

        star_us_dialog: {
            title: 'आम्हाला सुधारण्यास मदत करा!',
            description:
                'तुम्हाला GitHub वर आम्हाला स्टार करायचे आहे का? हे फक्त एक क्लिक दूर आहे!',
            close: 'आता नाही',
            confirm: 'नक्कीच!',
        },

        export_diagram_dialog: {
            title: 'Export Diagram',
            description: 'Choose the format for export:',
            format_json: 'JSON',
            cancel: 'Cancel',
            export: 'Export',
            error: {
                title: 'Error exporting diagram',
                description:
                    'Something went wrong. Need help? https://github.com/Lynn-Lee/SchemaFlow/issues',
            },
        },

        // TO
        import_diagram_dialog: {
            title: 'Import Diagram',
            description: 'Paste the diagram JSON below:',
            cancel: 'Cancel',
            import: 'Import',
            error: {
                title: 'Error importing diagram',
                description:
                    'The diagram JSON is invalid. Please check the JSON and try again. Need help? https://github.com/Lynn-Lee/SchemaFlow/issues',
            },
        },
        import_dbml_dialog: {
            example_title: 'Import Example DBML',
            title: 'Import DBML',
            description: 'Import a database schema from DBML format.',
            import: 'Import',
            cancel: 'Cancel',
            skip_and_empty: 'Skip & Empty',
            show_example: 'Show Example',
            error: {
                title: 'Error',
                description: 'Failed to parse DBML. Please check the syntax.',
            },
        },

        relationship_type: {
            one_to_one: 'एक ते एक',
            one_to_many: 'एक ते अनेक',
            many_to_one: 'अनेक ते एक',
            many_to_many: 'अनेक ते अनेक',
        },

        canvas_context_menu: {
            new_table: 'नवीन टेबल',
            new_view: 'नवीन व्ह्यू',
            new_relationship: 'नवीन रिलेशनशिप',
            new_area: 'नवीन क्षेत्र',
            new_note: 'नवीन टीप',
        },

        table_node_context_menu: {
            edit_table: 'टेबल संपादित करा',
            delete_table: 'टेबल हटवा',
            duplicate_table: 'Duplicate Table',
            add_relationship: 'Add Relationship',
            move_to_area: 'क्षेत्रात हलवा',
            no_area: 'क्षेत्र नाही',
        },

        templates_page: {
            heading_featured: 'Featured database schema templates',
            heading_tagged: 'Database schema templates for {{tag}}',
            heading_all: 'Database schema templates',
            breadcrumb: 'Templates',
            detail_subtitle: 'Database schema diagram',
            detail_meta_title:
                'Database schema diagram for {{name}} | SchemaFlow',
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

        examples_page: {
            meta_title: 'SchemaFlow - Example Database Diagrams & Schemas',
            heading: 'Examples',
            description:
                'A collection of examples to help you get started with SchemaFlow.',
            prompt: 'Click on one',
            items: {
                '1': {
                    name: 'Employees schema',
                    description:
                        'A schema for database of employees, departments, and salaries.',
                },
                '2': {
                    name: 'Bike stores schema',
                    description:
                        'A schema for database of bike stores, brands, categories, and customers.',
                },
                '3': {
                    name: 'DVD Rental schema',
                    description:
                        'A schema for database of a DVD rental store, including customers, films, actors, staff, and stores.',
                },
            },
        },

        canvas: {
            all_tables_hidden: 'सर्व टेबल्स लपवलेले आहेत',
            show_all_tables: 'सर्व दाखवा',
            mobile_notice: {
                title: 'Mobile editing is limited',
                description:
                    'For reliable canvas editing, use a desktop browser. You can continue on this device.',
                dismiss: 'Dismiss mobile canvas notice',
            },
        },

        canvas_filter: {
            title: 'टेबल्स फिल्टर करा',
            search_placeholder: 'टेबल्स शोधा...',
            group_by_schema: 'स्कीमानुसार गट करा',
            group_by_area: 'क्षेत्रानुसार गट करा',
            no_tables_found: 'कोणतेही टेबल सापडले नाही',
            empty_diagram_description: 'सुरू करण्यासाठी टेबल तयार करा',
            no_tables_description:
                'तुमची शोध किंवा फिल्टर समायोजित करण्याचा प्रयत्न करा',
            clear_filter: 'फिल्टर साफ करा',
        },

        snap_to_grid_tooltip: 'Snap to Grid (Hold {{key}})',

        tool_tips: {
            double_click_to_edit: 'Double-click to edit',
        },

        language_select: {
            change_language: 'भाषा बदला',
            screen_reader_change_language: 'Change language',
            experimental: 'experimental',
        },

        import_preview: {
            ready: 'Import preview ready',
            confidence: 'Confidence: {{confidence}}',
            tables: '{{count}} tables',
            relationships: '{{count}} relationships',
            custom_types: '{{count}} custom types',
            warnings: '{{count}} warnings',
            skipped: '{{objectType}}{{name}} was skipped: {{reason}}',
            errors: {
                no_importable_objects:
                    'Preview found no importable tables, relationships, or custom types. Check the pasted Smart Query JSON or the selected database dialect.',
                cancelled: 'Import preview cancelled.',
                parse_default: 'Unable to parse the import input.',
                parse_failed:
                    'Preview failed: {{message}}. Check the Smart Query JSON, SQL syntax, or dialect limitations before trying again.',
                message: '{{message}}',
            },
        },

        on: 'चालू',
        off: 'बंद',

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

export const mrMetadata: LanguageMetadata = {
    name: 'Marathi',
    nativeName: 'मराठी',
    code: 'mr',
};
