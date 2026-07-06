import type { LanguageMetadata, LanguageTranslation } from '../types';

export const gu: LanguageTranslation = {
    translation: {
        editor_sidebar: {
            new_diagram: 'નવું',
            browse: 'ખોલો',
            tables: 'ટેબલો',
            refs: 'રેફ્સ',
            dependencies: 'નિર્ભરતાઓ',
            custom_types: 'કસ્ટમ ટાઇપ',
            visuals: 'Visuals',
            docs: 'Docs',
            settings: 'Settings',
        },
        menu: {
            actions: {
                actions: 'ક્રિયાઓ',
                new: 'નવું...',
                browse: 'બધા ડેટાબેસ...',
                save: 'સાચવો',
                import: 'ડેટાબેસ આયાત કરો',
                export_sql: 'SQL નિકાસ કરો',
                export_as: 'રૂપે નિકાસ કરો',
                delete_diagram: 'કાઢી નાખો',
            },
            edit: {
                edit: 'ફેરફાર',
                undo: 'અનડુ',
                redo: 'રીડુ',
                clear: 'સાફ કરો',
            },
            view: {
                view: 'જુઓ',
                show_sidebar: 'સાઇડબાર બતાવો',
                hide_sidebar: 'સાઇડબાર છુપાવો',
                hide_cardinality: 'કાર્ડિનાલિટી છુપાવો',
                show_cardinality: 'કાર્ડિનાલિટી બતાવો',
                hide_field_attributes: 'ફીલ્ડ અટ્રિબ્યુટ્સ છુપાવો',
                show_field_attributes: 'ફીલ્ડ અટ્રિબ્યુટ્સ બતાવો',
                zoom_on_scroll: 'સ્ક્રોલ પર ઝૂમ કરો',
                show_views: 'ડેટાબેઝ વ્યૂઝ',
                theme: 'થિમ',
                show_dependencies: 'નિર્ભરતાઓ બતાવો',
                hide_dependencies: 'નિર્ભરતાઓ છુપાવો',
                show_minimap: 'Show Mini Map',
                hide_minimap: 'Hide Mini Map',
            },

            backup: {
                backup: 'બેકઅપ',
                export_diagram: 'ડાયાગ્રામ નિકાસ કરો',
                restore_diagram: 'ડાયાગ્રામ પુનઃસ્થાપિત કરો',
            },
            help: {
                help: 'મદદ',
                docs_website: 'દસ્તાવેજીકરણ',
            },
        },

        delete_diagram_alert: {
            title: 'ડાયાગ્રામ કાઢી નાખો',
            description:
                'આ ક્રિયા પરત નહીં લઇ શકાય. આ ડાયાગ્રામ કાયમ માટે કાઢી નાખવામાં આવશે.',
            cancel: 'રદ કરો',
            delete: 'કાઢી નાખો',
        },

        clear_diagram_alert: {
            title: 'ડાયાગ્રામ સાફ કરો',
            description:
                'આ ક્રિયા પરત નહીં લઇ શકાય. આ ડાયાગ્રામમાં બધા ડેટા કાયમ માટે કાઢી નાખશે.',
            cancel: 'રદ કરો',
            clear: 'સાફ કરો',
        },

        reorder_diagram_alert: {
            title: 'ડાયાગ્રામ ઑટોમેટિક ગોઠવો',
            description:
                'આ ક્રિયા ડાયાગ્રામમાં બધી ટેબલ્સને ફરીથી વ્યવસ્થિત કરશે. શું તમે ચાલુ રાખવા માંગો છો?',
            reorder: 'ઑટોમેટિક ગોઠવો',
            cancel: 'રદ કરો',
        },

        copy_to_clipboard_toast: {
            unsupported: {
                title: 'નકલ નિષ્ફળ',
                description: 'ક્લિપબોર્ડ આધારિત નથી',
            },
            failed: {
                title: 'નકલ નિષ્ફળ',
                description: 'કંઈક ખોટું થયું છે. કૃપા કરીને ફરી પ્રયાસ કરો.',
            },
        },

        theme: {
            system: 'સિસ્ટમ',
            light: 'હલકો',
            dark: 'ઘાટો',
        },

        zoom: {
            on: 'ચાલુ',
            off: 'બંધ',
        },

        last_saved: 'છેલ્લે સાચવ્યું',
        saved: 'સાચવ્યું',
        loading_diagram: 'ડાયાગ્રામ લોડ થઈ રહ્યું છે...',
        deselect_all: 'બધાને ડીસેલેક્ટ કરો',
        select_all: 'બધા પસંદ કરો',
        clear: 'સાફ કરો',
        show_more: 'વધુ બતાવો',
        show_less: 'ઓછું બતાવો',
        copy_to_clipboard: 'ક્લિપબોર્ડમાં નકલ કરો',
        copied: 'નકલ થયું!',

        side_panel: {
            view_all_options: 'બધા વિકલ્પો જુઓ...',
            tables_section: {
                tables: 'ટેબલ્સ',
                add_table: 'ટેબલ ઉમેરો',
                add_view: 'વ્યૂ ઉમેરો',
                filter: 'ફિલ્ટર',
                collapse: 'બધાને સકુચિત કરો',
                clear: 'Clear Filter',
                no_results: 'No tables found matching your filter.',
                show_list: 'Show Table List',
                show_dbml: 'Show DBML Editor',
                all_hidden: 'બધી ટેબલ્સ છુપાયેલી છે',
                show_all: 'બધું બતાવો',

                table: {
                    fields: 'ફીલ્ડ્સ',
                    nullable: 'Nullable?',
                    primary_key: 'પ્રાથમિક કી',
                    indexes: 'ઈન્ડેક્સ',
                    check_constraints: 'ચકાસણી નિયંત્રણો',
                    comments: 'ટિપ્પણીઓ',
                    no_comments: 'કોઈ ટિપ્પણીઓ નથી',
                    add_field: 'ફીલ્ડ ઉમેરો',
                    add_index: 'ઈન્ડેક્સ ઉમેરો',
                    add_check: 'ચકાસણી ઉમેરો',
                    index_select_fields: 'ફીલ્ડ્સ પસંદ કરો',
                    no_types_found: 'કોઈ પ્રકાર મળ્યા નથી',
                    field_name: 'નામ',
                    field_type: 'પ્રકાર',
                    field_actions: {
                        title: 'ફીલ્ડ લક્ષણો',
                        unique: 'અદ્વિતીય',
                        auto_increment: 'ઑટો ઇન્ક્રિમેન્ટ',
                        comments: 'ટિપ્પણીઓ',
                        no_comments: 'કોઈ ટિપ્પણીઓ નથી',
                        delete_field: 'ફીલ્ડ કાઢી નાખો',
                        default_value: 'Default Value',
                        no_default: 'No default',
                        character_length: 'Max Length',
                        precision: 'ચોકસાઈ',
                        scale: 'માપ',
                    },
                    index_actions: {
                        title: 'ઇન્ડેક્સ લક્ષણો',
                        name: 'નામ',
                        unique: 'અદ્વિતીય',
                        index_type: 'ઇન્ડેક્સ પ્રકાર',
                        delete_index: 'ઇન્ડેક્સ કાઢી નાખો',
                    },
                    check_constraint_actions: {
                        title: 'ચકાસણી નિયંત્રણ',
                        expression: 'અભિવ્યક્તિ',
                        delete: 'નિયંત્રણ કાઢી નાખો',
                    },
                    table_actions: {
                        title: 'ટેબલ ક્રિયાઓ',
                        change_schema: 'સ્કીમા બદલો',
                        add_field: 'ફીલ્ડ ઉમેરો',
                        add_index: 'ઇન્ડેક્સ ઉમેરો',
                        duplicate_table: 'ટેબલ ડુપ્લિકેટ કરો',
                        delete_table: 'ટેબલ કાઢી નાખો',
                    },
                },
                empty_state: {
                    title: 'કોઈ ટેબલ્સ નથી',
                    description: 'શરૂ કરવા માટે એક ટેબલ બનાવો',
                },
            },
            refs_section: {
                refs: 'રેફ્સ',
                filter: 'ફિલ્ટર',
                collapse: 'બધાને સકુચિત કરો',
                add_relationship: 'સંબંધ ઉમેરો',
                relationships: 'સંબંધો',
                dependencies: 'નિર્ભરતાઓ',
                relationship: {
                    relationship: 'સંબંધ',
                    primary: 'પ્રાથમિક ટેબલ',
                    foreign: 'સંબંધિત ટેબલ',
                    cardinality: 'કાર્ડિનાલિટી',
                    delete_relationship: 'કાઢી નાખો',
                    switch_tables: 'ટેબલ બદલો',
                    relationship_actions: {
                        title: 'ક્રિયાઓ',
                        delete_relationship: 'કાઢી નાખો',
                    },
                },
                dependency: {
                    dependency: 'નિર્ભરતા',
                    table: 'ટેબલ',
                    dependent_table: 'નિર્ભરશીલ વ્યૂ',
                    delete_dependency: 'કાઢી નાખો',
                    dependency_actions: {
                        title: 'ક્રિયાઓ',
                        delete_dependency: 'કાઢી નાખો',
                    },
                },
                empty_state: {
                    title: 'કોઈ સંબંધો નથી',
                    description: 'શરૂ કરવા માટે એક સંબંધ બનાવો',
                },
            },

            areas_section: {
                areas: 'વિસ્તારો',
                add_area: 'વિસ્તાર ઉમેરો',
                filter: 'ફિલ્ટર',
                clear: 'ફિલ્ટર સાફ કરો',
                no_results: 'તમારા ફિલ્ટરને અનુરૂપ કોઈ વિસ્તાર મળ્યો નથી.',

                area: {
                    area_actions: {
                        title: 'વિસ્તાર ક્રિયાઓ',
                        edit_name: 'નામ સંપાદિત કરો',
                        delete_area: 'વિસ્તાર કાઢી નાખો',
                    },
                },
                empty_state: {
                    title: 'કોઈ વિસ્તાર નથી',
                    description: 'શરૂ કરવા માટે વિસ્તાર બનાવો',
                },
            },

            visuals_section: {
                visuals: 'Visuals',
                tabs: {
                    areas: 'વિસ્તારો',
                    notes: 'નોંધો',
                },
            },

            notes_section: {
                filter: 'ફિલ્ટર',
                add_note: 'નોંધ ઉમેરો',
                no_results: 'કોઈ નોંધો મળી નથી',
                clear: 'ફિલ્ટર સાફ કરો',
                empty_state: {
                    title: 'કોઈ નોંધો નથી',
                    description:
                        'કેનવાસ પર ટેક્સ્ટ એનોટેશન ઉમેરવા માટે નોંધ બનાવો',
                },
                note: {
                    empty_note: 'ખાલી નોંધ',
                    note_actions: {
                        title: 'નોંધ ક્રિયાઓ',
                        edit_content: 'સામગ્રી સંપાદિત કરો',
                        delete_note: 'નોંધ કાઢી નાખો',
                    },
                },
            },

            custom_types_section: {
                custom_types: 'કસ્ટમ પ્રકાર',
                filter: 'ફિલ્ટર',
                clear: 'ફિલ્ટર સાફ કરો',
                no_results: 'તમારા ફિલ્ટરને અનુરૂપ કોઈ કસ્ટમ પ્રકાર મળ્યો નથી.',
                new_type: 'નવો પ્રકાર',
                empty_state: {
                    title: 'કોઈ કસ્ટમ પ્રકાર નથી',
                    description:
                        'જ્યારે તમારા ડેટાબેસમાં ઉપલબ્ધ હશે ત્યારે કસ્ટમ પ્રકાર અહીં દેખાશે',
                },
                custom_type: {
                    kind: 'પ્રકાર',
                    enum_values: 'Enum મૂલ્યો',
                    composite_fields: 'ફીલ્ડ્સ',
                    no_fields: 'કોઈ ફીલ્ડ વ્યાખ્યાયિત નથી',
                    no_values: 'કોઈ enum મૂલ્યો વ્યાખ્યાયિત નથી',
                    field_name_placeholder: 'ફીલ્ડનું નામ',
                    field_type_placeholder: 'પ્રકાર પસંદ કરો',
                    add_field: 'ફીલ્ડ ઉમેરો',
                    no_fields_tooltip:
                        'આ કસ્ટમ પ્રકાર માટે કોઈ ફીલ્ડ વ્યાખ્યાયિત નથી',
                    custom_type_actions: {
                        title: 'ક્રિયાઓ',
                        highlight_fields: 'ફીલ્ડ્સ હાઇલાઇટ કરો',
                        delete_custom_type: 'કાઢી નાખો',
                        clear_field_highlight: 'હાઇલાઇટ કાઢો',
                    },
                    delete_custom_type: 'પ્રકાર કાઢી નાખો',
                },
            },
        },

        toolbar: {
            zoom_in: 'ઝૂમ ઇન',
            zoom_out: 'ઝૂમ આઉટ',
            save: 'સાચવો',
            show_all: 'બધું બતાવો',
            undo: 'અનડુ',
            redo: 'રીડુ',
            reorder_diagram: 'ડાયાગ્રામ ઑટોમેટિક ગોઠવો',
            clear_custom_type_highlight: 'Clear highlight for "{{typeName}}"',
            custom_type_highlight_tooltip:
                'Highlighting "{{typeName}}" - Click to clear',
            highlight_overlapping_tables: 'ઓવરલેપ કરતો ટેબલ હાઇલાઇટ કરો',
            filter: 'ટેબલ ફિલ્ટર કરો',
        },

        new_diagram_dialog: {
            database_selection: {
                title: 'તમારું ડેટાબેસ શું છે?',
                description: 'દરેક ડેટાબેસની પોતાની ખાસિયતો અને ક્ષમતા હોય છે.',
                transactional: 'Transactional',
                analytical: 'Analytical',
                more_databases: 'More Databases',
                primary_databases: 'Primary Databases',
                check_examples_long: 'ઉદાહરણ જુઓ',
                check_examples_short: 'ઉદાહરણ',
            },

            import_database: {
                title: 'તમારું ડેટાબેસ આયાત કરો',
                database_edition: 'ડેટાબેસ આવૃત્તિ:',
                step_1: 'તમારા ડેટાબેસમાં આ સ્ક્રિપ્ટ ચલાવો:',
                step_2: 'સ્ક્રિપ્ટનો પરિણામ અહીં પેસ્ટ કરો →',
                script_results_placeholder: 'સ્ક્રિપ્ટના પરિણામ અહીં...',
                ssms_instructions: {
                    button_text: 'SSMS સૂચનાઓ',
                    title: 'સૂચનાઓ',
                    step_1: 'ટૂલ્સ > વિકલ્પો > ક્વેરી પરિણામો > SQL સર્વર પર જાઓ.',
                    step_2: 'જો તમે "ગ્રિડમાં પરિણામો" નો ઉપયોગ કરી રહ્યા છો, તો નોન-XML ડેટા માટે મહત્તમ અક્ષરો મેળવવું (9999999 પર સેટ કરો).',
                },
                instructions_link: 'મદદ જોઈએ? અહીં જુઓ',
                check_script_result: 'સ્ક્રિપ્ટ પરિણામ તપાસો',
            },

            cancel: 'રદ કરો',
            back: 'પાછા',
            import_from_file: 'ફાઇલમાંથી આયાત કરો',
            empty_diagram: 'ખાલી ડેટાબેસ',
            continue: 'ચાલુ રાખો',
            import: 'આયાત કરો',
        },

        open_diagram_dialog: {
            title: 'ડેટાબેસ ખોલો',
            description: 'નીચેની યાદીમાંથી એક ડાયાગ્રામ પસંદ કરો.',
            table_columns: {
                name: 'નામ',
                created_at: 'બનાવાની તારીખ',
                last_modified: 'છેલ્લું સુધારેલું',
                tables_count: 'ટેબલ્સ',
            },
            cancel: 'રદ કરો',
            open: 'ખોલો',
            new_database: 'નવું ડેટાબેસ',
            load_error: {
                title: 'Could not load local diagrams',
                description:
                    'Local diagrams could not be read. Check browser storage permissions or create a new database.',
                retry: 'Retry loading diagrams',
            },

            diagram_actions: {
                open: 'ખોલો',
                duplicate: 'ડુપ્લિકેટ',
                delete: 'કાઢી નાખો',
            },
        },

        export_sql_dialog: {
            title: 'SQL નિકાસ કરો',
            description:
                '{{databaseType}} સ્ક્રિપ્ટ માટે તમારું ડાયાગ્રામ સ્કીમા નિકાસ કરો',
            close: 'બંધ કરો',
            mode: {
                deterministic: 'Deterministic',
                ai: 'AI',
            },
            loading: {
                text: '{{databaseType}} માટે AI SQL બનાવી રહ્યું છે...',
                description: 'તેને 30 સેકંડ સુધીનો સમય લાગી શકે છે.',
            },
            error: {
                message:
                    'SQL સ્ક્રિપ્ટ જનરેટ કરવા દરમિયાન ભૂલ થઈ. કૃપા કરીને પછીથી ફરી પ્રયત્ન કરો અથવા <0>અમારો સંપર્ક કરો</0>.',
                description:
                    'તમારા OPENAI_TOKEN નો ઉપયોગ કરવા માટે મફત અનુભવો, મેન્યુઅલ <0>અહીં જુઓ</0>.',
            },
        },

        create_relationship_dialog: {
            title: 'સંબંધ બનાવો',
            primary_table: 'પ્રાથમિક ટેબલ',
            primary_field: 'પ્રાથમિક ફીલ્ડ',
            referenced_table: 'સંદર્ભિત ટેબલ',
            referenced_field: 'સંદર્ભિત ફીલ્ડ',
            primary_table_placeholder: 'ટેબલ પસંદ કરો',
            primary_field_placeholder: 'ફીલ્ડ પસંદ કરો',
            referenced_table_placeholder: 'ટેબલ પસંદ કરો',
            referenced_field_placeholder: 'ફીલ્ડ પસંદ કરો',
            no_tables_found: 'કોઈ ટેબલ મળી નથી',
            no_fields_found: 'કોઈ ફીલ્ડ મળી નથી',
            create: 'બનાવો',
            cancel: 'રદ કરો',
        },

        import_database_dialog: {
            title: 'વર્તમાન ડાયાગ્રામમાં આયાત કરો',
            override_alert: {
                title: 'ડેટાબેસ આયાત કરો',
                content: {
                    alert: 'આ ડાયાગ્રામ આયાત કરવાથી હાલના ટેબલ્સ અને સંબંધો પર અસર થશે.',
                    new_tables:
                        '<bold>{{newTablesNumber}}</bold> નવા ટેબલ ઉમેરવામાં આવશે.',
                    new_relationships:
                        '<bold>{{newRelationshipsNumber}}</bold> નવા સંબંધો બનાવવામાં આવશે.',
                    tables_override:
                        '<bold>{{tablesOverrideNumber}}</bold> ટેબલ ઓવરરાઇટ કરાશે.',
                    proceed: 'શું તમે આગળ વધવા માંગો છો?',
                },
                import: 'આયાત કરો',
                cancel: 'રદ કરો',
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
            title: 'છબી નિકાસ કરો',
            description: 'નિકાસ માટે સ્કેલ ફેક્ટર પસંદ કરો:',
            scale_1x: '1x (નીચી ગુણવત્તા)',
            scale_2x: '2x (સામાન્ય ગુણવત્તા)',
            scale_4x: '4x (શ્રેષ્ઠ ગુણવત્તા)',
            cancel: 'રદ કરો',
            export: 'નિકાસ કરો',
            advanced_options: 'Advanced Options',
            pattern: 'Include background pattern',
            pattern_description: 'Add subtle grid pattern to background.',
            transparent: 'Transparent background',
            transparent_description: 'Remove background color from image.',
        },

        new_table_schema_dialog: {
            title: 'સ્કીમા પસંદ કરો',
            description:
                'વર્તમાનમાં ઘણા સ્કીમા દર્શાવવામાં આવે છે. નવું ટેબલ માટે એક પસંદ કરો.',
            cancel: 'રદ કરો',
            confirm: 'ખાતરી કરો',
        },

        update_table_schema_dialog: {
            title: 'સ્કીમા બદલો',
            description: 'ટેબલ "{{tableName}}" માટે સ્કીમા અપડેટ કરો',
            cancel: 'રદ કરો',
            confirm: 'બદલો',
        },

        create_table_schema_dialog: {
            title: 'નવું સ્કીમા બનાવો',
            description:
                'હજી સુધી કોઈ સ્કીમા અસ્તિત્વમાં નથી. તમારા ટેબલ્સ ને વ્યવસ્થિત કરવા માટે તમારું પહેલું સ્કીમા બનાવો.',
            create: 'બનાવો',
            cancel: 'રદ કરો',
        },

        star_us_dialog: {
            title: 'અમને સુધારવામાં મદદ કરો!',
            description:
                'શું તમે GitHub પર અમને સ્ટાર આપી શકો છો? તે માત્ર એક ક્લિક દૂર છે!',
            close: 'હાલમાં નહીં',
            confirm: 'ખરેખર!',
        },

        export_diagram_dialog: {
            title: 'ડાયાગ્રામ નિકાસ કરો',
            description: 'નિકાસ માટે ફોર્મેટ પસંદ કરો:',
            format_json: 'JSON',
            cancel: 'રદ કરો',
            export: 'નિકાસ કરો',
            error: {
                title: 'ડાયાગ્રામ નિકાસમાં ભૂલ',
                description:
                    'કશુક તો ખોટું થયું. મદદ જોઈએ? https://github.com/Lynn-Lee/SchemaFlow/issues પર સંપર્ક કરો.',
            },
        },

        import_diagram_dialog: {
            title: 'ડાયાગ્રામ આયાત કરો',
            description: 'નીચે ડાયાગ્રામ JSON પેસ્ટ કરો:',
            cancel: 'રદ કરો',
            import: 'આયાત કરો',
            error: {
                title: 'ડાયાગ્રામ આયાતમાં ભૂલ',
                description:
                    'ડાયાગ્રામ JSON અમાન્ય છે. કૃપા કરીને JSON તપાસો અને ફરી પ્રયાસ કરો. મદદ જોઈએ? https://github.com/Lynn-Lee/SchemaFlow/issues પર સંપર્ક કરો.',
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
            one_to_one: 'એકથી એક',
            one_to_many: 'એકથી ઘણા',
            many_to_one: 'ઘણા થી એક',
            many_to_many: 'ઘણાથી ઘણા',
        },

        canvas_context_menu: {
            new_table: 'નવું ટેબલ',
            new_view: 'નવું વ્યૂ',
            new_relationship: 'નવો સંબંધ',
            new_area: 'નવો વિસ્તાર',
            new_note: 'નવી નોંધ',
        },

        table_node_context_menu: {
            edit_table: 'ટેબલ સંપાદિત કરો',
            duplicate_table: 'ટેબલ નકલ કરો',
            delete_table: 'ટેબલ કાઢી નાખો',
            add_relationship: 'Add Relationship',
            move_to_area: 'વિસ્તારમાં ખસેડો',
            no_area: 'કોઈ વિસ્તાર નહીં',
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
            all_tables_hidden: 'બધી ટેબલ્સ છુપાયેલી છે',
            show_all_tables: 'બધું બતાવો',
            mobile_notice: {
                title: 'Mobile editing is limited',
                description:
                    'For reliable canvas editing, use a desktop browser. You can continue on this device.',
                dismiss: 'Dismiss mobile canvas notice',
            },
        },

        canvas_filter: {
            title: 'ટેબલ્સ ફિલ્ટર કરો',
            search_placeholder: 'ટેબલ્સ શોધો...',
            group_by_schema: 'સ્કીમા પ્રમાણે ગ્રુપ કરો',
            group_by_area: 'વિસ્તાર પ્રમાણે ગ્રુપ કરો',
            no_tables_found: 'કોઈ ટેબલ મળી નથી',
            empty_diagram_description: 'શરૂ કરવા માટે ટેબલ બનાવો',
            no_tables_description:
                'તમારી શોધ અથવા ફિલ્ટર સમાયોજિત કરવાનો પ્રયાસ કરો',
            clear_filter: 'ફિલ્ટર સાફ કરો',
        },

        snap_to_grid_tooltip: 'ગ્રિડ પર સ્નેપ કરો (જમાવટ {{key}})',

        tool_tips: {
            double_click_to_edit: 'સંપાદિત કરવા માટે ડબલ-ક્લિક કરો',
        },

        language_select: {
            change_language: 'ભાષા બદલો',
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

        on: 'ચાલુ',
        off: 'બંધ',

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

export const guMetadata: LanguageMetadata = {
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    code: 'gu',
};
