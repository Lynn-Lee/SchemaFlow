import type { LanguageMetadata, LanguageTranslation } from '../types';

export const ar: LanguageTranslation = {
    translation: {
        editor_sidebar: {
            new_diagram: 'جديد',
            browse: 'فتح',
            tables: 'الجداول',
            refs: 'المراجع',
            dependencies: 'التبعيات',
            custom_types: 'الأنواع المخصصة',
            visuals: 'مرئيات',
            docs: 'Docs',
            settings: 'Settings',
        },
        menu: {
            actions: {
                actions: 'الإجراءات',
                new: 'جديد...',
                browse: 'جميع قواعد البيانات...',
                save: 'حفظ',
                import: 'استيراد قاعدة بيانات',
                export_sql: 'SQL تصدير',
                export_as: 'تصدير كـ',
                delete_diagram: 'حذف',
            },
            edit: {
                edit: 'تحرير',
                undo: 'تراجع',
                redo: 'إعادة',
                clear: 'مسح',
            },
            view: {
                view: 'عرض',
                show_sidebar: 'إظهار الشريط الجانبي',
                hide_sidebar: 'إخفاء الشريط الجانبي',
                hide_cardinality: 'إخفاء الكاردينالية',
                show_cardinality: 'إظهار الكاردينالية',
                hide_field_attributes: 'إخفاء خصائص الحقل',
                show_field_attributes: 'إظهار خصائص الحقل',
                zoom_on_scroll: 'تكبير/تصغير عند التمرير',
                show_views: 'عروض قاعدة البيانات',
                theme: 'المظهر',
                show_dependencies: 'إظهار الاعتمادات',
                hide_dependencies: 'إخفاء الاعتمادات',
                show_minimap: 'Show Mini Map',
                hide_minimap: 'Hide Mini Map',
            },
            backup: {
                backup: 'النسخ الاحتياطي',
                export_diagram: 'تصدير المخطط',
                restore_diagram: 'استعادة المخطط',
            },
            help: {
                help: 'مساعدة',
                docs_website: 'الوثائق',
            },
        },

        delete_diagram_alert: {
            title: 'حذف المخطط',
            description:
                '.لا يمكن التراجع عن هذا الإجراء. سيتم حذف الرسم البياني بشكل دائم',
            cancel: 'إلغاء',
            delete: 'حذف',
        },

        clear_diagram_alert: {
            title: 'مسح الرسم البياني',
            description:
                '.لا يمكن التراجع عن هذا الاجراء. سيتم حذف جميع البيانات في الرسم البياني بشكل دائم',
            cancel: 'إلغاء',
            clear: 'مسح',
        },

        reorder_diagram_alert: {
            title: 'ترتيب تلقائي للرسم البياني',
            description:
                'هذا الإجراء سيقوم بإعادة ترتيب الجداول في المخطط بشكل تلقائي. هل تريد المتابعة؟',
            reorder: 'ترتيب تلقائي',
            cancel: 'إلغاء',
        },

        copy_to_clipboard_toast: {
            unsupported: {
                title: 'فشل النسخ',
                description: '.الحافظة غير مدعومة',
            },
            failed: {
                title: 'فشل النسخ',
                description: 'حدث خطأ أثناء النسخ. حاول مجدداً',
            },
        },

        theme: {
            system: 'النظام',
            light: 'فاتح',
            dark: 'داكن',
        },

        zoom: {
            on: 'تشغيل',
            off: 'إيقاف',
        },

        last_saved: 'آخر حفظ',
        saved: 'تم الحفظ',
        loading_diagram: '...جارِ تحميل الرسم البياني',
        deselect_all: 'إلغاء تحديد الكل',
        select_all: 'تحديد الكل',
        clear: 'مسح',
        show_more: 'عرض المزيد',
        show_less: 'عرض أقل',
        copy_to_clipboard: 'نسخ إلى الحافظة',
        copied: '!تم النسخ',

        side_panel: {
            view_all_options: '...عرض جميع الخيارات',
            tables_section: {
                tables: 'الجداول',
                add_table: 'إضافة جدول',
                add_view: 'إضافة عرض',
                filter: 'تصفية',
                collapse: 'طي الكل',
                clear: 'Clear Filter',
                no_results: 'No tables found matching your filter.',
                show_list: 'Show Table List',
                show_dbml: 'Show DBML Editor',
                all_hidden: 'جميع الجداول مخفية',
                show_all: 'عرض الكل',

                table: {
                    fields: 'الحقول',
                    nullable: 'يمكن ان يكون فارغاً؟',
                    primary_key: 'المفتاح الأساسي',
                    indexes: 'الفهارس',
                    check_constraints: 'قيود التحقق',
                    comments: 'تعليقات',
                    no_comments: 'لا توجد تعليقات',
                    add_field: 'إضافة حقل',
                    add_index: 'إضافة فهرس',
                    add_check: 'إضافة تحقق',
                    index_select_fields: 'حدد الحقول',
                    no_types_found: 'لا يوجد أنواع',
                    field_name: 'الإسم',
                    field_type: 'النوع',
                    field_actions: {
                        title: 'خصائص الحقل',
                        unique: 'فريد',
                        auto_increment: 'زيادة تلقائية',
                        comments: 'تعليقات',
                        no_comments: 'لا يوجد تعليقات',
                        delete_field: 'حذف الحقل',
                        character_length: 'Max Length',
                        precision: 'الدقة',
                        scale: 'النطاق',
                        default_value: 'Default Value',
                        no_default: 'No default',
                    },
                    index_actions: {
                        title: 'خصائص الفهرس',
                        name: 'الإسم',
                        unique: 'فريد',
                        index_type: 'نوع الفهرس',
                        delete_index: 'حذف الفهرس',
                    },
                    check_constraint_actions: {
                        title: 'قيد التحقق',
                        expression: 'التعبير',
                        delete: 'حذف قيد التحقق',
                    },
                    table_actions: {
                        title: 'إجراءات الجدول',
                        change_schema: 'تغيير المخطط',
                        add_field: 'إضافة حقل',
                        add_index: 'إضافة فهرس',
                        duplicate_table: 'نسخ الجدول',
                        delete_table: 'حذف الجدول',
                    },
                },
                empty_state: {
                    title: 'لا توجد جداول',
                    description: 'أنشئ جدولاً للبدء',
                },
            },
            refs_section: {
                refs: 'المراجع',
                filter: 'تصفية',
                collapse: 'طي الكل',
                add_relationship: 'إضافة علاقة',
                relationships: 'العلاقات',
                dependencies: 'الاعتمادات',
                relationship: {
                    relationship: 'العلاقة',
                    primary: 'الجدول الأساسي',
                    foreign: 'الجدول المرتبط',
                    cardinality: 'الكاردينالية',
                    delete_relationship: 'حذف',
                    switch_tables: 'تبديل الجداول',
                    relationship_actions: {
                        title: 'إجراءات',
                        delete_relationship: 'حذف',
                    },
                },
                dependency: {
                    dependency: 'الاعتماد',
                    table: 'الجدول',
                    dependent_table: 'عرض الاعتمادات',
                    delete_dependency: 'حذف',
                    dependency_actions: {
                        title: 'إجراءات',
                        delete_dependency: 'حذف',
                    },
                },
                empty_state: {
                    title: 'لا توجد علاقات',
                    description: 'إنشاء علاقة للبدء',
                },
            },

            areas_section: {
                areas: 'المناطق',
                add_area: 'إضافة منطقة',
                filter: 'تصفية',
                clear: 'مسح التصفية',
                no_results: 'لم يتم العثور على مناطق مطابقة للتصفية.',

                area: {
                    area_actions: {
                        title: 'إجراءات المنطقة',
                        edit_name: 'تحرير الاسم',
                        delete_area: 'حذف المنطقة',
                    },
                },
                empty_state: {
                    title: 'لا توجد مناطق',
                    description: 'أنشئ منطقة للبدء',
                },
            },

            visuals_section: {
                visuals: 'مرئيات',
                tabs: {
                    areas: 'المناطق',
                    notes: 'ملاحظات',
                },
            },

            notes_section: {
                filter: 'تصفية',
                add_note: 'إضافة ملاحظة',
                no_results: 'لم يتم العثور على ملاحظات',
                clear: 'مسح التصفية',
                empty_state: {
                    title: 'لا توجد ملاحظات',
                    description: 'أنشئ ملاحظة لإضافة تعليقات نصية على اللوحة',
                },
                note: {
                    empty_note: 'ملاحظة فارغة',
                    note_actions: {
                        title: 'إجراءات الملاحظة',
                        edit_content: 'تحرير المحتوى',
                        delete_note: 'حذف الملاحظة',
                    },
                },
            },

            custom_types_section: {
                custom_types: 'الأنواع المخصصة',
                filter: 'تصفية',
                clear: 'مسح التصفية',
                no_results: 'لم يتم العثور على أنواع مخصصة مطابقة للتصفية.',
                new_type: 'نوع جديد',
                empty_state: {
                    title: 'لا توجد أنواع مخصصة',
                    description:
                        'ستظهر الأنواع المخصصة هنا عندما تكون متاحة في قاعدة البيانات الخاصة بك',
                },
                custom_type: {
                    kind: 'النوع',
                    enum_values: 'قيم التعداد',
                    composite_fields: 'الحقول',
                    no_fields: 'لم يتم تحديد حقول',
                    no_values: 'لم يتم تحديد قيم التعداد',
                    field_name_placeholder: 'اسم الحقل',
                    field_type_placeholder: 'اختر النوع',
                    add_field: 'إضافة حقل',
                    no_fields_tooltip: 'لم يتم تحديد حقول لهذا النوع المخصص',
                    custom_type_actions: {
                        title: 'إجراءات',
                        highlight_fields: 'تمييز الحقول',
                        delete_custom_type: 'حذف',
                        clear_field_highlight: 'إزالة التمييز',
                    },
                    delete_custom_type: 'حذف النوع',
                },
            },
        },

        toolbar: {
            zoom_in: 'تكبير',
            zoom_out: 'تصغير',
            save: 'حفظ',
            show_all: 'عرض الكل',
            undo: 'تراجع',
            redo: 'إعادة',
            reorder_diagram: 'ترتيب تلقائي للرسم البياني',
            highlight_overlapping_tables: 'تمييز الجداول المتداخلة',
            filter: 'تصفية الجداول',
            clear_custom_type_highlight: 'Clear highlight for "{{typeName}}"',
            custom_type_highlight_tooltip:
                'Highlighting "{{typeName}}" - Click to clear',
        },

        new_diagram_dialog: {
            database_selection: {
                title: 'ما هو نوع قاعدة البيانات الخاصة بك؟',
                description:
                    'تتمتع كل قاعدة بيانات بمميزاتها وقدراتها الفريدة.',
                check_examples_long: 'ألقي نظرة على الأمثلة',
                check_examples_short: 'أمثلة',
            },

            import_database: {
                title: 'إسترد قاعدة بياناتك',
                database_edition: ':إصدار قاعدة البيانات',
                step_1: ':قم بتشغيل هذا البرنامج النصي في قاعدة بياناتك',
                step_2: ':إلصق نتيجة البرنامج النصي هنا →',
                script_results_placeholder: '...نتيجة البرنامج النصي هنا',
                ssms_instructions: {
                    button_text: 'SSMS تعليمات',
                    title: 'تعليمات',
                    step_1: 'SQL SERVER < انتقل إلى الأدوات > الخيارات > نتائح الاستعلام',
                    step_2: '(اضبطها على 9999999) XML اذا كنت تستخدم "نتائج إلى الشبكة"، قم بتغيير الحد الاقصى للاحرف المستردة للبيانات غير',
                },
                instructions_link: 'تحتاج مساعدة؟ شاهد الفيديو',
                check_script_result: 'تحقق من نتيجة البرنامج النصي',
            },

            cancel: 'إلغاء',
            import_from_file: 'استيراد من ملف',
            back: 'رجوع',
            empty_diagram: 'قاعدة بيانات فارغة',
            continue: 'متابعة',
            import: 'استيراد',
        },

        open_diagram_dialog: {
            title: 'فتح قاعدة بيانات',
            description: 'اختر مخططًا لفتحه من القائمة ادناه',
            table_columns: {
                name: 'الإسم',
                created_at: 'تاريخ الإنشاء',
                last_modified: 'آخر تعديل',
                tables_count: 'الجداول',
            },
            cancel: 'إلغاء',
            open: 'فتح',
            new_database: 'قاعدة بيانات جديدة',
            load_error: {
                title: 'Could not load local diagrams',
                description:
                    'Local diagrams could not be read. Check browser storage permissions or create a new database.',
                retry: 'Retry loading diagrams',
            },

            diagram_actions: {
                open: 'فتح',
                duplicate: 'تكرار',
                delete: 'حذف',
            },
        },

        export_sql_dialog: {
            title: 'SQL تصدير',
            description:
                '{{databaseType}} صدّر مخطط الرسم البياني إلى برنامج نصي لـ',
            close: 'إغلاق',
            mode: {
                deterministic: 'Deterministic',
                ai: 'AI',
            },
            loading: {
                text: '...{{databaseType}} ل SQL يقوم الذكاء الاصطناعي بإنشاء',
                description: 'هذا قد يستغرق 30 ثانية',
            },
            error: {
                message:
                    'النصي. يرجى المحاولة مرة اخرى لاحقاً او <0>اتصل بنا</0> SQL خطأ في إنشاء برنامج',
                description:
                    ' الخاصة بك. راجع الدليل <0>هنا</0> OPENAI_TOKEN لا تتردد في استخدام',
            },
        },

        create_relationship_dialog: {
            title: 'إنشاء علاقة',
            primary_table: 'الجدول الأساسي',
            primary_field: 'الحقل الأساسي',
            referenced_table: 'الجدول المرتبط',
            referenced_field: 'الحقل المرتبط',
            primary_table_placeholder: 'حدد الجدول',
            primary_field_placeholder: 'حدد الحقل',
            referenced_table_placeholder: 'حدد الجدول',
            referenced_field_placeholder: 'حدد الحقل',
            no_tables_found: 'لم يتم العثور على جداول',
            no_fields_found: 'لم يتم العثور على حقول',
            create: 'إنشاء',
            cancel: 'إلغاء',
        },

        import_database_dialog: {
            title: 'استيراد إلى المخطط الحالي',
            override_alert: {
                title: 'استيراد قاعدة بيانات',
                content: {
                    alert: 'سيؤدي استيراد هذا المخطط إلى التأثير على الجداول والعلاقات الحالية.',
                    new_tables:
                        'جداول جديدة <bold>{{newTablesNumber}}</bold> سيتم إضافة',
                    new_relationships:
                        'علاقات جديدة <bold>{{newRelationshipsNumber}}</bold> سيتم إنشاء',
                    tables_override:
                        'جداول <bold>{{tablesOverrideNumber}}</bold> سيتم تعديل',
                    proceed: 'هل تريد المتابعة؟',
                },
                import: 'استيراد',
                cancel: 'إلغاء',
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
            title: 'تصدير الصورة',
            description: ':اختر عامل المقياس للتصدير',
            scale_1x: '1x (جودة منخفضة)',
            scale_2x: '2x (جودة عادية)',
            scale_4x: '4x (أفضل جودة)',
            cancel: 'إلغاء',
            export: 'تصدير',
            advanced_options: 'Advanced Options',
            pattern: 'Include background pattern',
            pattern_description: 'Add subtle grid pattern to background.',
            transparent: 'Transparent background',
            transparent_description: 'Remove background color from image.',
        },

        new_table_schema_dialog: {
            title: 'اختر مخططاً',
            description:
                '.يتم حالياً عرض مخططات متعددة. اختر واحداً للجدول الجديد',
            cancel: 'إلغاء',
            confirm: 'تأكيد',
        },

        update_table_schema_dialog: {
            title: 'تغيير المخطط',
            description: '"{{tableName}}" تحديث مخطط الجدول',
            cancel: 'إلغاء',
            confirm: 'تغيير',
        },
        create_table_schema_dialog: {
            title: 'إنشاء مخطط جديد',
            description:
                'لا توجد مخططات حتى الآن. قم بإنشاء أول مخطط لتنظيم جداولك.',
            create: 'إنشاء',
            cancel: 'إلغاء',
        },

        star_us_dialog: {
            title: '!ساعدنا على التحسن',
            description: '؟! إنها مجرد نقرة واحدةGITHUB هل ترغب في تقييمنا على',
            close: 'ليس الآن',
            confirm: '!بالتأكيد',
        },
        export_diagram_dialog: {
            title: 'تصدير المخطط',
            description: ':اختر التنسيق للتصدير',
            format_json: 'JSON',
            cancel: 'إلغاء',
            export: 'تصدير',
            error: {
                title: 'حدث خطأ أثناء التصدير',
                description:
                    'https://github.com/Lynn-Lee/SchemaFlow/issues حدث خطأ ما. هل تحتاج إلى مساعدة؟',
            },
        },
        import_diagram_dialog: {
            title: 'استيراد الرسم البياني',
            description: ':للرسم البياني ادناه JSON قم بلصق',
            cancel: 'إلغاء',
            import: 'استيراد',
            error: {
                title: 'حدث خطأ أثناء الاستيراد',
                description:
                    'https://github.com/Lynn-Lee/SchemaFlow/issues و المحاولة مرة اخرى. هل تحتاج إلى المساعدة؟ JSON غير صالح. يرجى التحقق من JSON الرسم البياني',
            },
        },
        import_dbml_dialog: {
            title: 'Import DBML',
            example_title: 'Import Example DBML',
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
            one_to_one: 'واحد إلى واحد',
            one_to_many: 'واحد إلى متعدد',
            many_to_one: 'متعدد إلى واحد',
            many_to_many: 'متعدد إلى متعدد',
        },

        canvas_context_menu: {
            new_table: 'جدول جديد',
            new_view: 'عرض جديد',
            new_relationship: 'علاقة جديدة',
            new_area: 'منطقة جديدة',
            new_note: 'ملاحظة جديدة',
        },

        table_node_context_menu: {
            edit_table: 'تعديل الجدول',
            duplicate_table: 'نسخ الجدول',
            delete_table: 'حذف الجدول',
            add_relationship: 'Add Relationship',
            move_to_area: 'نقل إلى منطقة',
            no_area: 'بدون منطقة',
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
            all_tables_hidden: 'جميع الجداول مخفية',
            show_all_tables: 'عرض الكل',
            mobile_notice: {
                title: 'Mobile editing is limited',
                description:
                    'For reliable canvas editing, use a desktop browser. You can continue on this device.',
                dismiss: 'Dismiss mobile canvas notice',
            },
        },

        canvas_filter: {
            title: 'تصفية الجداول',
            search_placeholder: 'البحث في الجداول...',
            group_by_schema: 'تجميع حسب المخطط',
            group_by_area: 'تجميع حسب المنطقة',
            no_tables_found: 'لم يتم العثور على جداول',
            empty_diagram_description: 'أنشئ جدولاً للبدء',
            no_tables_description: 'جرب تعديل البحث أو التصفية',
            clear_filter: 'مسح التصفية',
        },

        snap_to_grid_tooltip: '({{key}} مغنظة الشبكة (اضغط مع الاستمرار على',

        tool_tips: {
            double_click_to_edit: 'انقر مرتين للتعديل',
        },

        language_select: {
            change_language: 'اللغة',
        },
        on: 'تشغيل',
        off: 'إيقاف',

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

export const arMetadata: LanguageMetadata = {
    name: 'Arabic',
    nativeName: 'العربية',
    code: 'ar',
};
