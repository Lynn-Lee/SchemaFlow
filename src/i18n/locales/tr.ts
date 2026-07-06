import type { LanguageMetadata, LanguageTranslation } from '../types';

export const tr: LanguageTranslation = {
    translation: {
        editor_sidebar: {
            new_diagram: 'Yeni',
            browse: 'Aç',
            tables: 'Tablolar',
            refs: 'Refs',
            dependencies: 'Bağımlılıklar',
            custom_types: 'Özel Tipler',
            visuals: 'Görseller',
            docs: 'Docs',
            settings: 'Settings',
        },
        menu: {
            actions: {
                actions: 'Eylemler',
                new: 'Yeni...',
                browse: 'Tüm veritabanları...',
                save: 'Kaydet',
                import: 'Veritabanı İçe Aktar',
                export_sql: 'SQL Olarak Dışa Aktar',
                export_as: 'Olarak Dışa Aktar',
                delete_diagram: 'Sil',
            },
            edit: {
                edit: 'Düzenle',
                undo: 'Geri Al',
                redo: 'Yinele',
                clear: 'Temizle',
            },
            view: {
                view: 'Görünüm',
                show_sidebar: 'Kenar Çubuğunu Göster',
                hide_sidebar: 'Kenar Çubuğunu Gizle',
                hide_cardinality: 'Kardinaliteyi Gizle',
                show_cardinality: 'Kardinaliteyi Göster',
                show_field_attributes: 'Alan Özelliklerini Göster',
                hide_field_attributes: 'Alan Özelliklerini Gizle',
                zoom_on_scroll: 'Kaydırarak Yakınlaştır',
                show_views: 'Veritabanı Görünümleri',
                theme: 'Tema',
                show_dependencies: 'Bağımlılıkları Göster',
                hide_dependencies: 'Bağımlılıkları Gizle',
                show_minimap: 'Show Mini Map',
                hide_minimap: 'Hide Mini Map',
            },
            backup: {
                backup: 'Backup',
                export_diagram: 'Export Diagram',
                restore_diagram: 'Restore Diagram',
            },
            help: {
                help: 'Yardım',
                docs_website: 'Belgeleme',
            },
        },

        delete_diagram_alert: {
            title: 'Diyagramı Sil',
            description:
                'Bu işlem geri alınamaz. Diyagram kalıcı olarak silinecektir.',
            cancel: 'İptal',
            delete: 'Sil',
        },

        clear_diagram_alert: {
            title: 'Diyagramı Temizle',
            description:
                'Bu işlem geri alınamaz. Diyagramdaki tüm veriler kalıcı olarak silinecektir.',
            cancel: 'İptal',
            clear: 'Temizle',
        },

        reorder_diagram_alert: {
            title: 'Diyagramı Otomatik Düzenle',
            description:
                'Bu işlem tüm tabloları yeniden düzenleyecektir. Devam etmek istiyor musunuz?',
            reorder: 'Otomatik Düzenle',
            cancel: 'İptal',
        },

        copy_to_clipboard_toast: {
            unsupported: {
                title: 'Kopyalama başarısız',
                description: 'Panoya desteklenmiyor',
            },
            failed: {
                title: 'Kopyalama başarısız',
                description: 'Bir şeyler ters gitti. Lütfen tekrar deneyin.',
            },
        },

        theme: {
            system: 'Sistem',
            light: 'Açık',
            dark: 'Koyu',
        },

        zoom: {
            on: 'Açık',
            off: 'Kapalı',
        },

        last_saved: 'Son kaydedilen',
        saved: 'Kaydedildi',
        loading_diagram: 'Diyagram yükleniyor...',
        deselect_all: 'Hepsini Seçme',
        select_all: 'Hepsini Seç',
        clear: 'Temizle',
        show_more: 'Daha Fazla Göster',
        show_less: 'Daha Az Göster',
        copy_to_clipboard: 'Panoya Kopyala',
        copied: 'Kopyalandı!',
        side_panel: {
            view_all_options: 'Tüm Seçenekleri Gör...',
            tables_section: {
                tables: 'Tablolar',
                add_table: 'Tablo Ekle',
                add_view: 'Görünüm Ekle',
                filter: 'Filtrele',
                collapse: 'Hepsini Daralt',
                clear: 'Clear Filter',
                no_results: 'No tables found matching your filter.',
                show_list: 'Show Table List',
                show_dbml: 'Show DBML Editor',
                all_hidden: 'Tüm tablolar gizli',
                show_all: 'Tümünü göster',

                table: {
                    fields: 'Alanlar',
                    nullable: 'Boş Bırakılabilir?',
                    primary_key: 'Birincil Anahtar',
                    indexes: 'İndeksler',
                    check_constraints: 'Kontrol Kısıtlamaları',
                    comments: 'Yorumlar',
                    no_comments: 'Yorum yok',
                    add_field: 'Alan Ekle',
                    add_index: 'İndeks Ekle',
                    add_check: 'Kontrol Ekle',
                    index_select_fields: 'Alanları Seç',
                    no_types_found: 'Tür bulunamadı',
                    field_name: 'Ad',
                    field_type: 'Tür',
                    field_actions: {
                        title: 'Alan Özellikleri',
                        unique: 'Tekil',
                        auto_increment: 'Otomatik Artış',
                        comments: 'Yorumlar',
                        no_comments: 'Yorum yok',
                        delete_field: 'Alanı Sil',
                        default_value: 'Default Value',
                        no_default: 'No default',
                        character_length: 'Max Length',
                        precision: 'Hassasiyet',
                        scale: 'Ölçek',
                    },
                    index_actions: {
                        title: 'İndeks Özellikleri',
                        name: 'Ad',
                        unique: 'Tekil',
                        index_type: 'İndeks Türü',
                        delete_index: 'İndeksi Sil',
                    },
                    check_constraint_actions: {
                        title: 'Kontrol Kısıtlaması',
                        expression: 'İfade',
                        delete: 'Kısıtlamayı Sil',
                    },
                    table_actions: {
                        title: 'Tablo İşlemleri',
                        change_schema: 'Şemayı Değiştir',
                        add_field: 'Alan Ekle',
                        add_index: 'İndeks Ekle',
                        duplicate_table: 'Duplicate Table',
                        delete_table: 'Tabloyu Sil',
                    },
                },
                empty_state: {
                    title: 'Tablo yok',
                    description: 'Başlamak için bir tablo oluşturun',
                },
            },
            refs_section: {
                refs: 'Refs',
                filter: 'Filtrele',
                collapse: 'Hepsini Daralt',
                add_relationship: 'İlişki Ekle',
                relationships: 'İlişkiler',
                dependencies: 'Bağımlılıklar',
                relationship: {
                    relationship: 'İlişki',
                    primary: 'Birincil Tablo',
                    foreign: 'İlişkili Tablo',
                    cardinality: 'Kardinalite',
                    delete_relationship: 'Sil',
                    switch_tables: 'Tabloları Değiştir',
                    relationship_actions: {
                        title: 'İşlemler',
                        delete_relationship: 'Sil',
                    },
                },
                dependency: {
                    dependency: 'Bağımlılık',
                    table: 'Tablo',
                    dependent_table: 'Bağımlı Görünüm',
                    delete_dependency: 'Sil',
                    dependency_actions: {
                        title: 'İşlemler',
                        delete_dependency: 'Sil',
                    },
                },
                empty_state: {
                    title: 'İlişki yok',
                    description: 'Başlamak için bir ilişki oluşturun',
                },
            },

            areas_section: {
                areas: 'Alanlar',
                add_area: 'Alan Ekle',
                filter: 'Filtrele',
                clear: 'Filtreyi Temizle',
                no_results: 'Filtrenizle eşleşen alan bulunamadı.',

                area: {
                    area_actions: {
                        title: 'Alan İşlemleri',
                        edit_name: 'Adı Düzenle',
                        delete_area: 'Alanı Sil',
                    },
                },
                empty_state: {
                    title: 'Alan yok',
                    description: 'Başlamak için bir alan oluşturun',
                },
            },

            visuals_section: {
                visuals: 'Görseller',
                tabs: {
                    areas: 'Alanlar',
                    notes: 'Notlar',
                },
            },

            notes_section: {
                filter: 'Filtrele',
                add_note: 'Not Ekle',
                no_results: 'Not bulunamadı',
                clear: 'Filtreyi Temizle',
                empty_state: {
                    title: 'Not Yok',
                    description:
                        'Tuval üzerinde metin açıklamaları eklemek için bir not oluşturun',
                },
                note: {
                    empty_note: 'Boş not',
                    note_actions: {
                        title: 'Not İşlemleri',
                        edit_content: 'İçeriği Düzenle',
                        delete_note: 'Notu Sil',
                    },
                },
            },

            custom_types_section: {
                custom_types: 'Özel Tipler',
                filter: 'Filtrele',
                clear: 'Filtreyi Temizle',
                no_results: 'Filtrenizle eşleşen özel tip bulunamadı.',
                new_type: 'Yeni Tip',
                empty_state: {
                    title: 'Özel tip yok',
                    description:
                        'Veritabanınızda mevcut olduğunda özel tipler burada görünecektir',
                },
                custom_type: {
                    kind: 'Tür',
                    enum_values: 'Enum Değerleri',
                    composite_fields: 'Alanlar',
                    no_fields: 'Alan tanımlanmamış',
                    no_values: 'Tanımlanmış enum değeri yok',
                    field_name_placeholder: 'Alan adı',
                    field_type_placeholder: 'Tip seçin',
                    add_field: 'Alan Ekle',
                    no_fields_tooltip: 'Bu özel tip için alan tanımlanmamış',
                    custom_type_actions: {
                        title: 'İşlemler',
                        highlight_fields: 'Alanları Vurgula',
                        delete_custom_type: 'Sil',
                        clear_field_highlight: 'Vurguyu Kaldır',
                    },
                    delete_custom_type: 'Tipi Sil',
                },
            },
        },
        toolbar: {
            zoom_in: 'Yakınlaştır',
            zoom_out: 'Uzaklaştır',
            save: 'Kaydet',
            show_all: 'Hepsini Gör',
            undo: 'Geri Al',
            redo: 'Yinele',
            reorder_diagram: 'Diyagramı Otomatik Düzenle',
            clear_custom_type_highlight: 'Clear highlight for "{{typeName}}"',
            custom_type_highlight_tooltip:
                'Highlighting "{{typeName}}" - Click to clear',
            highlight_overlapping_tables: 'Çakışan Tabloları Vurgula',
            filter: 'Tabloları Filtrele',
        },
        new_diagram_dialog: {
            database_selection: {
                title: 'Veritabanınız nedir?',
                description:
                    'Her veritabanının kendine özgü özellikleri ve yetenekleri vardır.',
                transactional: 'Transactional',
                analytical: 'Analytical',
                more_databases: 'More Databases',
                primary_databases: 'Primary Databases',
                check_examples_long: 'Örnekleri Kontrol Et',
                check_examples_short: 'Örnekler',
            },
            import_database: {
                title: 'Veritabanını İçe Aktar',
                database_edition: 'Veritabanı Sürümü:',
                step_1: 'Bu komut dosyasını veritabanınızda çalıştırın:',
                step_2: 'Komut dosyası sonucunu buraya yapıştırın →',
                script_results_placeholder: 'Komut dosyası sonuçları burada...',
                ssms_instructions: {
                    button_text: 'SSMS Talimatları',
                    title: 'Talimatlar',
                    step_1: "Araçlar > Seçenekler > Sorgu Sonuçları > SQL Server'a gidin.",
                    step_2: 'Eğer "Sonuçlar Izgaraya" kullanıyorsanız, Maksimum Karakterlerin Alınması için XML olmayan veriler (9999999 olarak ayarlanmış) değiştirin.',
                },
                instructions_link:
                    'Yardıma mı ihtiyacınız var? İzlemek için tıklayın',
                check_script_result: 'Komut Dosyası Sonucunu Kontrol Et',
            },
            import_from_file: 'Import from File',
            cancel: 'İptal',
            back: 'Geri',
            empty_diagram: 'Boş veritabanı',
            continue: 'Devam',
            import: 'İçe Aktar',
        },
        open_diagram_dialog: {
            title: 'Veritabanı Aç',
            description: 'Aşağıdaki listeden açmak için bir diyagram seçin.',
            table_columns: {
                name: 'Ad',
                created_at: 'Oluşturulma Tarihi',
                last_modified: 'Son Değiştirme',
                tables_count: 'Tablolar',
            },
            cancel: 'İptal',
            open: 'Aç',
            new_database: 'Yeni Veritabanı',
            load_error: {
                title: 'Could not load local diagrams',
                description:
                    'Local diagrams could not be read. Check browser storage permissions or create a new database.',
                retry: 'Retry loading diagrams',
            },

            diagram_actions: {
                open: 'Aç',
                duplicate: 'Kopyala',
                delete: 'Sil',
            },
        },

        export_sql_dialog: {
            title: 'SQL Olarak Dışa Aktar',
            description:
                'Diyagram şemanızı {{databaseType}} betiğine dışa aktarın',
            close: 'Kapat',
            mode: {
                deterministic: 'Deterministic',
                ai: 'AI',
            },
            loading: {
                text: 'AI, SQL oluşturuyor {{databaseType}}...',
                description: 'Bu işlem en fazla 30 saniye sürecektir.',
            },
            error: {
                message:
                    'SQL betiği oluşturulurken hata oluştu. Lütfen daha sonra tekrar deneyin veya <0>bize ulaşın</0>.',
                description:
                    "OPENAI_TOKEN'ınızı kullanabilirsiniz, kılavuzu <0>buradan</0> görebilirsiniz.",
            },
        },
        create_relationship_dialog: {
            title: 'İlişki Oluştur',
            primary_table: 'Birincil Tablo',
            primary_field: 'Birincil Alan',
            referenced_table: 'Referans Tablo',
            referenced_field: 'Referans Alan',
            primary_table_placeholder: 'Tablo seç',
            primary_field_placeholder: 'Alan seç',
            referenced_table_placeholder: 'Tablo seç',
            referenced_field_placeholder: 'Alan seç',
            no_tables_found: 'Tablo bulunamadı',
            no_fields_found: 'Alan bulunamadı',
            create: 'Oluştur',
            cancel: 'İptal',
        },
        import_database_dialog: {
            title: 'Mevcut Diyagrama İçe Aktar',
            override_alert: {
                title: 'Veritabanını İçe Aktar',
                content: {
                    alert: 'Bu diyagramı içe aktarmak mevcut tabloları ve ilişkileri etkileyecektir.',
                    new_tables:
                        '<bold>{{newTablesNumber}}</bold> yeni tablo eklenecek.',
                    new_relationships:
                        '<bold>{{newRelationshipsNumber}}</bold> yeni ilişki oluşturulacak.',
                    tables_override:
                        '<bold>{{tablesOverrideNumber}}</bold> tablo üzerine yazılacak.',
                    proceed: 'Devam etmek istiyor musunuz?',
                },
                import: 'İçe Aktar',
                cancel: 'İptal',
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
            title: 'Resmi Dışa Aktar',
            description: 'Dışa aktarım için ölçek faktörünü seçin:',
            scale_1x: '1x (Düşük Kalite)',
            scale_2x: '2x (Normal Kalite)',
            scale_4x: '4x (En İyi Kalite)',
            cancel: 'İptal',
            export: 'Dışa Aktar',
            advanced_options: 'Advanced Options',
            pattern: 'Include background pattern',
            pattern_description: 'Add subtle grid pattern to background.',
            transparent: 'Transparent background',
            transparent_description: 'Remove background color from image.',
        },
        new_table_schema_dialog: {
            title: 'Şema Seç',
            description:
                'Şu anda birden fazla şema görüntülenmektedir. Yeni tablo için birini seçin.',
            cancel: 'İptal',
            confirm: 'Onayla',
        },
        update_table_schema_dialog: {
            title: 'Şemayı Değiştir',
            description: 'Tablo "{{tableName}}" şemasını güncelle',
            cancel: 'İptal',
            confirm: 'Değiştir',
        },

        create_table_schema_dialog: {
            title: 'Yeni Şema Oluştur',
            description:
                'Henüz hiç şema mevcut değil. Tablolarınızı düzenlemek için ilk şemanızı oluşturun.',
            create: 'Oluştur',
            cancel: 'İptal',
        },
        star_us_dialog: {
            title: 'Bize yardım et!',
            description:
                "Bizi GitHub'da yıldızlamak ister misiniz? Sadece bir tık uzakta!",
            close: 'Şimdi Değil',
            confirm: 'Tabii ki!',
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
            one_to_one: 'Bir Bir',
            one_to_many: 'Bir Çok',
            many_to_one: 'Çok Bir',
            many_to_many: 'Çok Çok',
        },
        canvas_context_menu: {
            new_table: 'Yeni Tablo',
            new_view: 'Yeni Görünüm',
            new_relationship: 'Yeni İlişki',
            new_area: 'Yeni Alan',
            new_note: 'Yeni Not',
        },
        table_node_context_menu: {
            edit_table: 'Tabloyu Düzenle',
            delete_table: 'Tabloyu Sil',
            duplicate_table: 'Duplicate Table',
            add_relationship: 'Add Relationship',
            move_to_area: 'Alana Taşı',
            no_area: 'Alan Yok',
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
            all_tables_hidden: 'Tüm tablolar gizli',
            show_all_tables: 'Tümünü göster',
            mobile_notice: {
                title: 'Mobile editing is limited',
                description:
                    'For reliable canvas editing, use a desktop browser. You can continue on this device.',
                dismiss: 'Dismiss mobile canvas notice',
            },
        },

        canvas_filter: {
            title: 'Tabloları Filtrele',
            search_placeholder: 'Tablo ara...',
            group_by_schema: 'Şemaya Göre Grupla',
            group_by_area: 'Alana Göre Grupla',
            no_tables_found: 'Tablo bulunamadı',
            empty_diagram_description: 'Başlamak için bir tablo oluşturun',
            no_tables_description:
                'Aramanızı veya filtrenizi ayarlamayı deneyin',
            clear_filter: 'Filtreyi temizle',
        },

        snap_to_grid_tooltip: 'Snap to Grid (Hold {{key}})',

        tool_tips: {
            double_click_to_edit: 'Double-click to edit',
        },

        language_select: {
            change_language: 'Dil',
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

        on: 'Açık',
        off: 'Kapalı',

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

export const trMetadata: LanguageMetadata = {
    nativeName: 'Türkçe',
    name: 'Turkish',
    code: 'tr',
};
