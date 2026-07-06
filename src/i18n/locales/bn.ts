import type { LanguageMetadata, LanguageTranslation } from '../types';

export const bn: LanguageTranslation = {
    translation: {
        editor_sidebar: {
            new_diagram: 'নতুন',
            browse: 'খুলুন',
            tables: 'টেবিল',
            refs: 'রেফস',
            dependencies: 'নির্ভরতা',
            custom_types: 'কাস্টম টাইপ',
            visuals: 'ভিজ্যুয়াল',
        },
        menu: {
            actions: {
                actions: 'কার্য',
                new: 'নতুন...',
                browse: 'সমস্ত ডেটাবেস...',
                save: 'সংরক্ষণ করুন',
                import: 'ডাটাবেস আমদানি করুন',
                export_sql: 'SQL রপ্তানি করুন',
                export_as: 'রূপে রপ্তানি করুন',
                delete_diagram: 'মুছুন',
            },
            edit: {
                edit: 'সম্পাদনা',
                undo: 'পূর্বাবস্থায় ফিরুন',
                redo: 'পুনরায় করুন',
                clear: 'পরিষ্কার করুন',
            },
            view: {
                view: 'দেখুন',
                show_sidebar: 'সাইডবার দেখান',
                hide_sidebar: 'সাইডবার লুকান',
                hide_cardinality: 'কার্ডিনালিটি লুকান',
                show_cardinality: 'কার্ডিনালিটি দেখান',
                hide_field_attributes: 'ফিল্ড অ্যাট্রিবিউট লুকান',
                show_field_attributes: 'ফিল্ড অ্যাট্রিবিউট দেখান',
                zoom_on_scroll: 'স্ক্রলে জুম করুন',
                show_views: 'ডাটাবেস ভিউ',
                theme: 'থিম',
                show_dependencies: 'নির্ভরতাগুলি দেখান',
                hide_dependencies: 'নির্ভরতাগুলি লুকান',
                show_minimap: 'Show Mini Map',
                hide_minimap: 'Hide Mini Map',
            },

            backup: {
                backup: 'ব্যাকআপ',
                export_diagram: 'ডায়াগ্রাম রপ্তানি করুন',
                restore_diagram: 'ডায়াগ্রাম পুনরুদ্ধার করুন',
            },
            help: {
                help: 'সাহায্য',
                docs_website: 'ডকুমেন্টেশন',
                join_discord: 'আমাদের Discord-এ যোগ দিন',
            },
        },

        delete_diagram_alert: {
            title: 'ডায়াগ্রাম মুছুন',
            description:
                'এই কাজটি পূর্বাবস্থায় ফিরিয়ে আনা যাবে না। এই ডায়াগ্রাম স্থায়ীভাবে মুছে ফেলা হবে।',
            cancel: 'বাতিল করুন',
            delete: 'মুছুন',
        },

        clear_diagram_alert: {
            title: 'ডায়াগ্রাম পরিষ্কার করুন',
            description:
                'এই কাজটি পূর্বাবস্থায় ফিরিয়ে আনা যাবে না। এই ডায়াগ্রামের সমস্ত তথ্য স্থায়ীভাবে মুছে যাবে।',
            cancel: 'বাতিল করুন',
            clear: 'পরিষ্কার করুন',
        },

        reorder_diagram_alert: {
            title: 'স্বয়ংক্রিয় ডায়াগ্রাম সাজান',
            description:
                'এই কাজটি ডায়াগ্রামের সমস্ত টেবিল পুনর্বিন্যাস করবে। আপনি কি চালিয়ে যেতে চান?',
            reorder: 'স্বয়ংক্রিয় সাজান',
            cancel: 'বাতিল করুন',
        },

        copy_to_clipboard_toast: {
            unsupported: {
                title: 'কপি ব্যর্থ হয়েছে',
                description: 'ক্লিপবোর্ড সমর্থিত নয়',
            },
            failed: {
                title: 'কপি ব্যর্থ হয়েছে',
                description: 'কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
            },
        },

        theme: {
            system: 'সিস্টেম',
            light: 'হালকা',
            dark: 'অন্ধকার',
        },

        zoom: {
            on: 'চালু',
            off: 'বন্ধ',
        },

        last_saved: 'সর্বশেষ সংরক্ষণ',
        saved: 'সংরক্ষিত',
        loading_diagram: 'ডায়াগ্রাম লোড হচ্ছে...',
        deselect_all: 'সব নির্বাচন সরান',
        select_all: 'সব নির্বাচন করুন',
        clear: 'পরিষ্কার করুন',
        show_more: 'আরও দেখুন',
        show_less: 'কম দেখুন',
        copy_to_clipboard: 'ক্লিপবোর্ডে অনুলিপি করুন',
        copied: 'অনুলিপি সম্পন্ন!',

        side_panel: {
            view_all_options: 'সমস্ত বিকল্প দেখুন...',
            tables_section: {
                tables: 'টেবিল',
                add_table: 'টেবিল যোগ করুন',
                add_view: 'ভিউ যোগ করুন',
                filter: 'ফিল্টার',
                collapse: 'সব ভাঁজ করুন',
                clear: 'Clear Filter',
                no_results: 'No tables found matching your filter.',
                show_list: 'Show Table List',
                show_dbml: 'Show DBML Editor',
                all_hidden: 'সব টেবিল লুকানো আছে',
                show_all: 'সব দেখান',

                table: {
                    fields: 'ফিল্ড',
                    nullable: 'নালযোগ্য?',
                    primary_key: 'প্রাথমিক কী',
                    indexes: 'ইনডেক্স',
                    check_constraints: 'চেক সীমাবদ্ধতা',
                    comments: 'মন্তব্য',
                    no_comments: 'কোনো মন্তব্য নেই',
                    add_field: 'ফিল্ড যোগ করুন',
                    add_index: 'ইনডেক্স যোগ করুন',
                    add_check: 'চেক যোগ করুন',
                    index_select_fields: 'ফিল্ড নির্বাচন করুন',
                    no_types_found: 'কোনো ধরন পাওয়া যায়নি',
                    field_name: 'নাম',
                    field_type: 'ধরন',
                    field_actions: {
                        title: 'ফিল্ড কর্ম',
                        unique: 'অদ্বিতীয়',
                        auto_increment: 'স্বয়ংক্রিয় বৃদ্ধি',
                        comments: 'মন্তব্য',
                        no_comments: 'কোনো মন্তব্য নেই',
                        delete_field: 'ফিল্ড মুছুন',
                        default_value: 'Default Value',
                        no_default: 'No default',
                        character_length: 'Max Length',
                        precision: 'নির্ভুলতা',
                        scale: 'স্কেল',
                    },
                    index_actions: {
                        title: 'ইনডেক্স কর্ম',
                        name: 'নাম',
                        unique: 'অদ্বিতীয়',
                        index_type: 'ইনডেক্স ধরন',
                        delete_index: 'ইনডেক্স মুছুন',
                    },
                    check_constraint_actions: {
                        title: 'চেক সীমাবদ্ধতা',
                        expression: 'এক্সপ্রেশন',
                        delete: 'সীমাবদ্ধতা মুছুন',
                    },
                    table_actions: {
                        title: 'টেবিল কর্ম',
                        change_schema: 'স্কিমা পরিবর্তন করুন',
                        add_field: 'ফিল্ড যোগ করুন',
                        add_index: 'ইনডেক্স যোগ করুন',
                        duplicate_table: 'টেবিল নকল করুন',
                        delete_table: 'টেবিল মুছুন',
                    },
                },
                empty_state: {
                    title: 'কোনো টেবিল নেই',
                    description: 'শুরু করতে একটি টেবিল তৈরি করুন',
                },
            },
            refs_section: {
                refs: 'রেফস',
                filter: 'ফিল্টার',
                collapse: 'সব ভাঁজ করুন',
                add_relationship: 'সম্পর্ক যোগ করুন',
                relationships: 'সম্পর্ক',
                dependencies: 'নির্ভরতাগুলি',
                relationship: {
                    relationship: 'সম্পর্ক',
                    primary: 'প্রাথমিক টেবিল',
                    foreign: 'সম্পর্কিত টেবিল',
                    cardinality: 'কার্ডিনালিটি',
                    delete_relationship: 'মুছুন',
                    switch_tables: 'টেবিল বদল করুন',
                    relationship_actions: {
                        title: 'কর্ম',
                        delete_relationship: 'মুছুন',
                    },
                },
                dependency: {
                    dependency: 'নির্ভরতা',
                    table: 'টেবিল',
                    dependent_table: 'নির্ভরশীল ভিউ',
                    delete_dependency: 'মুছুন',
                    dependency_actions: {
                        title: 'কর্ম',
                        delete_dependency: 'মুছুন',
                    },
                },
                empty_state: {
                    title: 'কোনো সম্পর্ক নেই',
                    description: 'শুরু করতে একটি সম্পর্ক তৈরি করুন',
                },
            },

            areas_section: {
                areas: 'এলাকা',
                add_area: 'এলাকা যোগ করুন',
                filter: 'ফিল্টার',
                clear: 'ফিল্টার সাফ করুন',
                no_results:
                    'আপনার ফিল্টারের সাথে মেলে এমন কোনো এলাকা পাওয়া যায়নি।',

                area: {
                    area_actions: {
                        title: 'এলাকা ক্রিয়া',
                        edit_name: 'নাম সম্পাদনা করুন',
                        delete_area: 'এলাকা মুছুন',
                    },
                },
                empty_state: {
                    title: 'কোনো এলাকা নেই',
                    description: 'শুরু করতে একটি এলাকা তৈরি করুন',
                },
            },

            visuals_section: {
                visuals: 'ভিজ্যুয়াল',
                tabs: {
                    areas: 'এলাকা',
                    notes: 'নোট',
                },
            },

            notes_section: {
                filter: 'ফিল্টার',
                add_note: 'নোট যোগ করুন',
                no_results: 'কোনো নোট পাওয়া যায়নি',
                clear: 'ফিল্টার সাফ করুন',
                empty_state: {
                    title: 'কোনো নোট নেই',
                    description:
                        'ক্যানভাসে টেক্সট টীকা যোগ করতে একটি নোট তৈরি করুন',
                },
                note: {
                    empty_note: 'খালি নোট',
                    note_actions: {
                        title: 'নোট ক্রিয়া',
                        edit_content: 'বিষয়বস্তু সম্পাদনা',
                        delete_note: 'নোট মুছুন',
                    },
                },
            },

            custom_types_section: {
                custom_types: 'কাস্টম টাইপ',
                filter: 'ফিল্টার',
                clear: 'ফিল্টার সাফ করুন',
                no_results:
                    'আপনার ফিল্টারের সাথে মেলে এমন কোনো কাস্টম টাইপ পাওয়া যায়নি।',
                new_type: 'নতুন টাইপ',
                empty_state: {
                    title: 'কোনো কাস্টম টাইপ নেই',
                    description:
                        'আপনার ডাটাবেসে উপলব্ধ হলে কাস্টম টাইপ এখানে দেখা যাবে',
                },
                custom_type: {
                    kind: 'ধরন',
                    enum_values: 'Enum মান',
                    composite_fields: 'ফিল্ড',
                    no_fields: 'কোনো ফিল্ড সংজ্ঞায়িত নেই',
                    no_values: 'কোন enum মান সংজ্ঞায়িত নেই',
                    field_name_placeholder: 'ফিল্ডের নাম',
                    field_type_placeholder: 'টাইপ নির্বাচন করুন',
                    add_field: 'ফিল্ড যোগ করুন',
                    no_fields_tooltip:
                        'এই কাস্টম টাইপের জন্য কোনো ফিল্ড সংজ্ঞায়িত নেই',
                    custom_type_actions: {
                        title: 'ক্রিয়া',
                        highlight_fields: 'ফিল্ড হাইলাইট করুন',
                        delete_custom_type: 'মুছুন',
                        clear_field_highlight: 'হাইলাইট সরান',
                    },
                    delete_custom_type: 'টাইপ মুছুন',
                },
            },
        },

        toolbar: {
            zoom_in: 'জুম ইন',
            zoom_out: 'জুম আউট',
            save: 'সংরক্ষণ করুন',
            show_all: 'সব দেখান',
            undo: 'পূর্বাবস্থায় ফিরুন',
            redo: 'পুনরায় করুন',
            reorder_diagram: 'স্বয়ংক্রিয় ডায়াগ্রাম সাজান',
            highlight_overlapping_tables: 'ওভারল্যাপিং টেবিল হাইলাইট করুন',

            clear_custom_type_highlight: 'Clear highlight for "{{typeName}}"',
            custom_type_highlight_tooltip:
                'Highlighting "{{typeName}}" - Click to clear',
            filter: 'টেবিল ফিল্টার করুন',
        },

        new_diagram_dialog: {
            database_selection: {
                title: 'আপনার ডাটাবেস কী?',
                description:
                    'প্রত্যেক ডাটাবেসের নিজস্ব বৈশিষ্ট্য এবং ক্ষমতা রয়েছে।',
                check_examples_long: 'উদাহরণ দেখুন',
                check_examples_short: 'উদাহরণ',
            },

            import_database: {
                title: 'আপনার ডাটাবেস আমদানি করুন',
                database_edition: 'ডাটাবেস সংস্করণ:',
                step_1: 'আপনার ডাটাবেসে এই স্ক্রিপ্ট চালান:',
                step_2: 'স্ক্রিপ্টের ফলাফল এখানে পেস্ট করুন →',
                script_results_placeholder: 'স্ক্রিপ্টের ফলাফল এখানে...',
                ssms_instructions: {
                    button_text: 'SSMS নির্দেশনা',
                    title: 'নির্দেশনা',
                    step_1: 'টুলস > অপশন > কোয়েরি ফলাফল > SQL সার্ভারে যান।',
                    step_2: 'যদি আপনি "গ্রিডে ফলাফল" ব্যবহার করেন, তাহলে নন-XML ডেটার জন্য সর্বাধিক চরিত্রগুলি 9999999-এ সেট করুন।',
                },
                instructions_link: 'সাহায্যের প্রয়োজন? এখানে দেখুন',
                check_script_result: 'স্ক্রিপ্ট ফলাফল যাচাই করুন',
            },

            cancel: 'বাতিল করুন',
            back: 'ফিরে যান',
            import_from_file: 'ফাইল থেকে আমদানি করুন',
            empty_diagram: 'খালি ডাটাবেস',
            continue: 'চালিয়ে যান',
            import: 'আমদানি করুন',
        },

        open_diagram_dialog: {
            title: 'ডেটাবেস খুলুন',
            description: 'নিচের তালিকা থেকে একটি চিত্র নির্বাচন করুন।',
            table_columns: {
                name: 'নাম',
                created_at: 'তৈরির তারিখ',
                last_modified: 'সর্বশেষ পরিবর্তিত',
                tables_count: 'টেবিল',
            },
            cancel: 'বাতিল করুন',
            open: 'খুলুন',
            new_database: 'নতুন ডেটাবেস',

            diagram_actions: {
                open: 'খুলুন',
                duplicate: 'ডুপ্লিকেট',
                delete: 'মুছুন',
            },
        },

        export_sql_dialog: {
            title: 'SQL রপ্তানি করুন',
            description:
                '{{databaseType}} স্ক্রিপ্টের জন্য আপনার ডায়াগ্রাম স্কিমা রপ্তানি করুন',
            close: 'বন্ধ করুন',
            mode: {
                deterministic: 'Deterministic',
                ai: 'AI',
            },
            loading: {
                text: '{{databaseType}} এর জন্য AI SQL তৈরি হচ্ছে...',
                description: 'এতে ৩০ সেকেন্ড পর্যন্ত সময় লাগতে পারে।',
            },
            error: {
                message:
                    'SQL স্ক্রিপ্ট তৈরি করার সময় একটি ত্রুটি ঘটেছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন বা <0>আমাদের সাথে যোগাযোগ করুন</0>।',
                description:
                    'আপনার OPENAI_TOKEN ব্যবহার করার জন্য বিনামূল্যে অভিজ্ঞতা নিন, ম্যানুয়াল <0>এখানে দেখুন</0>।',
            },
        },

        create_relationship_dialog: {
            title: 'সম্পর্ক তৈরি করুন',
            primary_table: 'প্রাথমিক টেবিল',
            primary_field: 'প্রাথমিক ক্ষেত্র',
            referenced_table: 'রেফারেন্স করা টেবিল',
            referenced_field: 'রেফারেন্স করা ক্ষেত্র',
            primary_table_placeholder: 'টেবিল নির্বাচন করুন',
            primary_field_placeholder: 'ক্ষেত্র নির্বাচন করুন',
            referenced_table_placeholder: 'টেবিল নির্বাচন করুন',
            referenced_field_placeholder: 'ক্ষেত্র নির্বাচন করুন',
            no_tables_found: 'কোন টেবিল পাওয়া যায়নি',
            no_fields_found: 'কোন ক্ষেত্র পাওয়া যায়নি',
            create: 'তৈরি করুন',
            cancel: 'বাতিল করুন',
        },

        import_database_dialog: {
            title: 'বর্তমান চিত্রে আমদানি করুন',
            override_alert: {
                title: 'ডাটাবেস আমদানি করুন',
                content: {
                    alert: 'এই চিত্র আমদানির ফলে বিদ্যমান টেবিল ও সম্পর্ক প্রভাবিত হবে।',
                    new_tables:
                        '<bold>{{newTablesNumber}}</bold> নতুন টেবিল যোগ করা হবে।',
                    new_relationships:
                        '<bold>{{newRelationshipsNumber}}</bold> নতুন সম্পর্ক তৈরি করা হবে।',
                    tables_override:
                        '<bold>{{tablesOverrideNumber}}</bold> টেবিল ওভাররাইট করা হবে।',
                    proceed: 'আপনি কি এগিয়ে যেতে চান?',
                },
                import: 'আমদানি করুন',
                cancel: 'বাতিল করুন',
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
            title: 'চিত্র রপ্তানি করুন',
            description: 'রপ্তানির জন্য স্কেল ফ্যাক্টর নির্বাচন করুন:',
            scale_1x: '1x (নিম্ন মান)',
            scale_2x: '2x (সাধারণ মান)',
            scale_4x: '4x (সেরা মান)',
            cancel: 'বাতিল করুন',
            export: 'রপ্তানি করুন',
            advanced_options: 'Advanced Options',
            pattern: 'Include background pattern',
            pattern_description: 'Add subtle grid pattern to background.',
            transparent: 'Transparent background',
            transparent_description: 'Remove background color from image.',
        },

        new_table_schema_dialog: {
            title: 'স্কিমা নির্বাচন করুন',
            description:
                'বর্তমানে অনেক স্কিমা প্রদর্শিত হচ্ছে। নতুন টেবিলের জন্য একটি নির্বাচন করুন।',
            cancel: 'বাতিল করুন',
            confirm: 'নিশ্চিত করুন',
        },

        update_table_schema_dialog: {
            title: 'স্কিমা পরিবর্তন করুন',
            description: 'টেবিল "{{tableName}}" এর জন্য স্কিমা আপডেট করুন',
            cancel: 'বাতিল করুন',
            confirm: 'পরিবর্তন করুন',
        },
        create_table_schema_dialog: {
            title: 'নতুন স্কিমা তৈরি করুন',
            description:
                'এখনও কোনো স্কিমা নেই। আপনার টেবিলগুলি সংগঠিত করতে আপনার প্রথম স্কিমা তৈরি করুন।',
            create: 'তৈরি করুন',
            cancel: 'বাতিল করুন',
        },

        star_us_dialog: {
            title: 'আমাদের উন্নত করতে সাহায্য করুন!',
            description:
                'আপনি কি GitHub-এ আমাদের একটি স্টার দিতে পারবেন? এটি মাত্র এক ক্লিক দূরে!',
            close: 'এখন নয়',
            confirm: 'অবশ্যই!',
        },

        export_diagram_dialog: {
            title: 'চিত্র রপ্তানি করুন',
            description: 'রপ্তানির জন্য ফরম্যাট নির্বাচন করুন:',
            format_json: 'JSON',
            cancel: 'বাতিল করুন',
            export: 'রপ্তানি করুন',
            error: {
                title: 'চিত্র রপ্তানিতে ত্রুটি',
                description:
                    'কিছু ভুল হয়েছে। সাহায্যের প্রয়োজন? https://github.com/Lynn-Lee/SchemaFlow/issues-এ যোগাযোগ করুন।',
            },
        },

        import_diagram_dialog: {
            title: 'চিত্র আমদানি করুন',
            description: 'নীচে ডায়াগ্রাম JSON পেস্ট করুন:',
            cancel: 'বাতিল করুন',
            import: 'আমদানি করুন',
            error: {
                title: 'চিত্র আমদানিতে ত্রুটি',
                description:
                    'ডায়াগ্রাম JSON অবৈধ। অনুগ্রহ করে JSON পরীক্ষা করুন এবং আবার চেষ্টা করুন। সাহায্যের প্রয়োজন? https://github.com/Lynn-Lee/SchemaFlow/issues-এ যোগাযোগ করুন।',
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
            one_to_one: 'এক থেকে এক',
            one_to_many: 'এক থেকে অনেক',
            many_to_one: 'অনেক থেকে এক',
            many_to_many: 'অনেক থেকে অনেক',
        },

        canvas_context_menu: {
            new_table: 'নতুন টেবিল',
            new_view: 'নতুন ভিউ',
            new_relationship: 'নতুন সম্পর্ক',
            new_area: 'নতুন এলাকা',
            new_note: 'নতুন নোট',
        },

        table_node_context_menu: {
            edit_table: 'টেবিল সম্পাদনা করুন',
            duplicate_table: 'টেবিল নকল করুন',
            delete_table: 'টেবিল মুছে ফেলুন',
            add_relationship: 'Add Relationship',
            move_to_area: 'এলাকায় সরান',
            no_area: 'কোনো এলাকা নেই',
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
            all_tables_hidden: 'সব টেবিল লুকানো আছে',
            show_all_tables: 'সব দেখান',
            mobile_notice: {
                title: 'Mobile editing is limited',
                description:
                    'For reliable canvas editing, use a desktop browser. You can continue on this device.',
                dismiss: 'Dismiss mobile canvas notice',
            },
        },

        canvas_filter: {
            title: 'টেবিল ফিল্টার করুন',
            search_placeholder: 'টেবিল খুঁজুন...',
            group_by_schema: 'স্কিমা অনুযায়ী গ্রুপ করুন',
            group_by_area: 'এলাকা অনুযায়ী গ্রুপ করুন',
            no_tables_found: 'কোনো টেবিল পাওয়া যায়নি',
            empty_diagram_description: 'শুরু করতে একটি টেবিল তৈরি করুন',
            no_tables_description: 'আপনার অনুসন্ধান বা ফিল্টার সামঞ্জস্য করুন',
            clear_filter: 'ফিল্টার মুছুন',
        },

        snap_to_grid_tooltip: 'গ্রিডে স্ন্যাপ করুন (অবস্থান {{key}})',

        tool_tips: {
            double_click_to_edit: 'সম্পাদনা করতে ডাবল-ক্লিক করুন',
        },

        language_select: {
            change_language: 'ভাষা পরিবর্তন করুন',
        },

        on: 'চালু',
        off: 'বন্ধ',

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
    },
};

export const bnMetadata: LanguageMetadata = {
    name: 'Bengali',
    nativeName: 'বাংলা',
    code: 'bn',
};
