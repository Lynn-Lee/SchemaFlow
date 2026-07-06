import type { LanguageMetadata, LanguageTranslation } from '../types';

export const vi: LanguageTranslation = {
    translation: {
        editor_sidebar: {
            new_diagram: 'Mới',
            browse: 'Mở',
            tables: 'Bảng',
            refs: 'Refs',
            dependencies: 'Phụ thuộc',
            custom_types: 'Kiểu tùy chỉnh',
            visuals: 'Hình ảnh',
            docs: 'Docs',
            settings: 'Settings',
        },
        menu: {
            actions: {
                actions: 'Hành động',
                new: 'Mới...',
                browse: 'Tất cả cơ sở dữ liệu...',
                save: 'Lưu',
                import: 'Nhập cơ sở dữ liệu',
                export_sql: 'Xuất SQL',
                export_as: 'Xuất thành',
                delete_diagram: 'Xóa',
            },
            edit: {
                edit: 'Sửa',
                undo: 'Hoàn tác',
                redo: 'Làm lại',
                clear: 'Xóa',
            },
            view: {
                view: 'Xem',
                show_sidebar: 'Hiển thị thanh bên',
                hide_sidebar: 'Ẩn thanh bên',
                hide_cardinality: 'Ẩn số lượng',
                show_cardinality: 'Hiển thị số lượng',
                show_field_attributes: 'Hiển thị thuộc tính trường',
                hide_field_attributes: 'Ẩn thuộc tính trường',
                zoom_on_scroll: 'Thu phóng khi cuộn',
                show_views: 'Chế độ xem Cơ sở dữ liệu',
                theme: 'Chủ đề',
                show_dependencies: 'Hiển thị các phụ thuộc',
                hide_dependencies: 'Ẩn các phụ thuộc',
                show_minimap: 'Show Mini Map',
                hide_minimap: 'Hide Mini Map',
            },
            backup: {
                backup: 'Hỗ trợ',
                export_diagram: 'Xuất sơ đồ',
                restore_diagram: 'Khôi phục sơ đồ',
            },
            help: {
                help: 'Trợ giúp',
                docs_website: 'Tài liệu',
            },
        },

        delete_diagram_alert: {
            title: 'Xóa sơ đồ',
            description:
                'Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn sơ đồ.',
            cancel: 'Hủy',
            delete: 'Xóa',
        },

        clear_diagram_alert: {
            title: 'Xóa dữ liệu trong sơ đồ',
            description:
                'Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn mọi dữ liệu trong sơ đồ.',
            cancel: 'Hủy',
            clear: 'Xóa',
        },

        reorder_diagram_alert: {
            title: 'Tự động sắp xếp sơ đồ',
            description:
                'Hành động này sẽ sắp xếp lại tất cả các bảng trong sơ đồ. Bạn có muốn tiếp tục không?',
            reorder: 'Tự động sắp xếp',
            cancel: 'Hủy',
        },

        copy_to_clipboard_toast: {
            unsupported: {
                title: 'Sao chép thất bại',
                description: 'Không hỗ trợ bảng tạm',
            },
            failed: {
                title: 'Sao chép thất bại',
                description: 'Đã xảy ra lỗi. Vui lòng thử lại.',
            },
        },

        theme: {
            system: 'Hệ thống',
            light: 'Sáng',
            dark: 'Tối',
        },

        zoom: {
            on: 'Bật',
            off: 'Tất',
        },

        last_saved: 'Đã lưu lần cuối',
        saved: 'Đã lưu',
        loading_diagram: 'Đang tải sơ đồ...',
        deselect_all: 'Bỏ chọn tất cả',
        select_all: 'Chọn tất cả',
        clear: 'Xóa',
        show_more: 'Hiển thị thêm',
        show_less: 'Hiển thị ít hơn',
        copy_to_clipboard: 'Sao chép vào bảng tạm',
        copied: 'Đã sao chép!',

        side_panel: {
            view_all_options: 'Xem tất cả tùy chọn...',
            tables_section: {
                tables: 'Bảng',
                add_table: 'Thêm bảng',
                add_view: 'Thêm Chế độ xem',
                filter: 'Lọc',
                collapse: 'Thu gọn tất cả',
                clear: 'Clear Filter',
                no_results: 'No tables found matching your filter.',
                show_list: 'Show Table List',
                show_dbml: 'Show DBML Editor',
                all_hidden: 'Tất cả bảng đã bị ẩn',
                show_all: 'Hiển thị tất cả',

                table: {
                    fields: 'Trường',
                    nullable: 'Có thể NULL?',
                    primary_key: 'Khóa chính',
                    indexes: 'Chỉ mục',
                    check_constraints: 'Ràng buộc kiểm tra',
                    comments: 'Bình luận',
                    no_comments: 'Không có bình luận',
                    add_field: 'Thêm trường',
                    add_index: 'Thêm chỉ mục',
                    add_check: 'Thêm kiểm tra',
                    index_select_fields: 'Chọn trường',
                    no_types_found: 'Không tìm thấy',
                    field_name: 'Tên trường',
                    field_type: 'Loại trường',
                    field_actions: {
                        title: 'Thuộc tính trường',
                        unique: 'Giá trị duy nhất',
                        auto_increment: 'Tự động tăng',
                        comments: 'Bình luận',
                        no_comments: 'Không có bình luận',
                        delete_field: 'Xóa trường',
                        default_value: 'Default Value',
                        no_default: 'No default',
                        character_length: 'Max Length',
                        precision: 'Độ chính xác',
                        scale: 'Tỷ lệ',
                    },
                    index_actions: {
                        title: 'Thuộc tính chỉ mục',
                        name: 'Tên',
                        unique: 'Giá trị duy nhất',
                        index_type: 'Loại chỉ mục',
                        delete_index: 'Xóa chỉ mục',
                    },
                    check_constraint_actions: {
                        title: 'Ràng buộc kiểm tra',
                        expression: 'Biểu thức',
                        delete: 'Xóa ràng buộc',
                    },
                    table_actions: {
                        title: 'Hành động',
                        change_schema: 'Thay đổi lược đồ',
                        add_field: 'Thêm trường',
                        add_index: 'Thêm chỉ mục',
                        duplicate_table: 'Nhân đôi bảng',
                        delete_table: 'Xóa bảng',
                    },
                },
                empty_state: {
                    title: 'Không có bảng',
                    description: 'Tạo một bảng để bắt đầu',
                },
            },
            refs_section: {
                refs: 'Refs',
                filter: 'Lọc',
                collapse: 'Thu gọn tất cả',
                add_relationship: 'Thêm quan hệ',
                relationships: 'Quan hệ',
                dependencies: 'Phụ thuộc',
                relationship: {
                    relationship: 'Quan hệ',
                    primary: 'Bảng chính',
                    foreign: 'Bảng liên quan',
                    cardinality: 'Quan hệ',
                    delete_relationship: 'Xóa',
                    switch_tables: 'Đổi Bảng',
                    relationship_actions: {
                        title: 'Hành động',
                        delete_relationship: 'Xóa',
                    },
                },
                dependency: {
                    dependency: 'Phụ thuộc',
                    table: 'Bảng',
                    dependent_table: 'Bảng xem phụ thuộc',
                    delete_dependency: 'Xóa',
                    dependency_actions: {
                        title: 'Hành động',
                        delete_dependency: 'Xóa',
                    },
                },
                empty_state: {
                    title: 'Không có quan hệ',
                    description: 'Tạo một quan hệ để bắt đầu',
                },
            },

            areas_section: {
                areas: 'Khu vực',
                add_area: 'Thêm Khu vực',
                filter: 'Lọc',
                clear: 'Xóa Bộ Lọc',
                no_results: 'Không tìm thấy khu vực nào phù hợp với bộ lọc.',

                area: {
                    area_actions: {
                        title: 'Hành động Khu vực',
                        edit_name: 'Sửa Tên',
                        delete_area: 'Xóa Khu vực',
                    },
                },
                empty_state: {
                    title: 'Không có khu vực',
                    description: 'Tạo khu vực để bắt đầu',
                },
            },

            visuals_section: {
                visuals: 'Hình ảnh',
                tabs: {
                    areas: 'Khu vực',
                    notes: 'Ghi chú',
                },
            },

            notes_section: {
                filter: 'Lọc',
                add_note: 'Thêm Ghi Chú',
                no_results: 'Không tìm thấy ghi chú',
                clear: 'Xóa Bộ Lọc',
                empty_state: {
                    title: 'Không Có Ghi Chú',
                    description:
                        'Tạo ghi chú để thêm chú thích văn bản trên canvas',
                },
                note: {
                    empty_note: 'Ghi chú trống',
                    note_actions: {
                        title: 'Hành Động Ghi Chú',
                        edit_content: 'Chỉnh Sửa Nội Dung',
                        delete_note: 'Xóa Ghi Chú',
                    },
                },
            },

            custom_types_section: {
                custom_types: 'Loại Tùy Chỉnh',
                filter: 'Lọc',
                clear: 'Xóa Bộ Lọc',
                no_results:
                    'Không tìm thấy loại tùy chỉnh nào phù hợp với bộ lọc.',
                new_type: 'Loại Mới',
                empty_state: {
                    title: 'Không có loại tùy chỉnh',
                    description:
                        'Các loại tùy chỉnh sẽ xuất hiện ở đây khi có sẵn trong cơ sở dữ liệu của bạn',
                },
                custom_type: {
                    kind: 'Loại',
                    enum_values: 'Giá Trị Enum',
                    composite_fields: 'Trường',
                    no_fields: 'Chưa định nghĩa trường',
                    no_values: 'Không có giá trị enum được định nghĩa',
                    field_name_placeholder: 'Tên trường',
                    field_type_placeholder: 'Chọn loại',
                    add_field: 'Thêm Trường',
                    no_fields_tooltip:
                        'Chưa định nghĩa trường cho loại tùy chỉnh này',
                    custom_type_actions: {
                        title: 'Hành động',
                        highlight_fields: 'Làm Nổi Bật Trường',
                        delete_custom_type: 'Xóa',
                        clear_field_highlight: 'Xóa Làm Nổi Bật',
                    },
                    delete_custom_type: 'Xóa Loại',
                },
            },
        },

        toolbar: {
            zoom_in: 'Phóng to',
            zoom_out: 'Thu nhỏ',
            save: 'Lưu',
            show_all: 'Hiển thị tất cả',
            undo: 'Hoàn tác',
            redo: 'Làm lại',
            reorder_diagram: 'Tự động sắp xếp sơ đồ',
            clear_custom_type_highlight: 'Clear highlight for "{{typeName}}"',
            custom_type_highlight_tooltip:
                'Highlighting "{{typeName}}" - Click to clear',
            highlight_overlapping_tables: 'Làm nổi bật các bảng chồng chéo',
            filter: 'Lọc Bảng',
        },

        new_diagram_dialog: {
            database_selection: {
                title: 'Cơ sở dữ liệu của bạn là gì?',
                description:
                    'Mỗi cơ sở dữ liệu có những tính năng và khả năng riêng biệt.',
                transactional: 'Transactional',
                analytical: 'Analytical',
                more_databases: 'More Databases',
                primary_databases: 'Primary Databases',
                check_examples_long: 'Xem ví dụ',
                check_examples_short: 'Ví dụ',
            },

            import_database: {
                title: 'Nhập cơ sở dữ liệu của bạn',
                database_edition: 'Loại:',
                step_1: 'Chạy lệnh này trong cơ sở dữ liệu của bạn:',
                step_2: 'Dán kết quả vào đây →',
                script_results_placeholder: 'Kết quả...',
                ssms_instructions: {
                    button_text: 'Hướng dẫn SSMS',
                    title: 'Hướng dẫn',
                    step_1: 'Đi đến Tools > Options > Query Results > SQL Server.',
                    step_2: 'Nếu bạn đang sử dụng "Results to Grid," thay đổi Maximum Characters Retrieved cho Non-XML (đặt thành 9999999).',
                },
                instructions_link: 'Cần trợ giúp? Xem ngay',
                check_script_result: 'Xem kết quả',
            },

            cancel: 'Hủy',
            import_from_file: 'Nhập từ tệp',
            back: 'Trở lại',
            empty_diagram: 'Cơ sở dữ liệu trống',
            continue: 'Tiếp tục',
            import: 'Nhập',
        },

        open_diagram_dialog: {
            title: 'Mở cơ sở dữ liệu',
            description: 'Chọn sơ đồ để mở từ danh sách bên dưới.',
            table_columns: {
                name: 'Tên',
                created_at: 'Tạo vào lúc',
                last_modified: 'Lần cuối chỉnh sửa',
                tables_count: 'Số bảng',
            },
            cancel: 'Hủy',
            open: 'Mở',
            new_database: 'Cơ sở dữ liệu mới',
            load_error: {
                title: 'Could not load local diagrams',
                description:
                    'Local diagrams could not be read. Check browser storage permissions or create a new database.',
                retry: 'Retry loading diagrams',
            },

            diagram_actions: {
                open: 'Mở',
                duplicate: 'Nhân bản',
                delete: 'Xóa',
            },
        },

        export_sql_dialog: {
            title: 'Xuất SQL',
            description: 'Xuất sơ đồ của bạn sang {{databaseType}}',
            close: 'Đóng',
            mode: {
                deterministic: 'Deterministic',
                ai: 'AI',
            },
            loading: {
                text: 'AI đang tạo SQL cho {{databaseType}}...',
                description: 'Việc này có thể mất khoảng 30 giây.',
            },
            error: {
                message:
                    'Lỗi khi tạo SQL. Vui lòng thử lại sau hoặc <0>liên hệ với chúng tôi</0>.',
                description:
                    'Bạn có thể sử dụng OPENAI_TOKEN, xem hướng dẫn <0>tại đây</0>.',
            },
        },

        create_relationship_dialog: {
            title: 'Tạo quan hệ',
            primary_table: 'Bảng chính',
            primary_field: 'Khóa chính',
            referenced_table: 'Bảng tham chiếu',
            referenced_field: 'Khóa tham chiếu',
            primary_table_placeholder: 'Chọn bảng',
            primary_field_placeholder: 'Chọn trường',
            referenced_table_placeholder: 'Chọn bảng',
            referenced_field_placeholder: 'Chọn trường',
            no_tables_found: 'Không tìm thấy bảng',
            no_fields_found: 'Không tìm thấy trường',
            create: 'Tạo',
            cancel: 'Hủy',
        },

        import_database_dialog: {
            title: 'Nhập vào sơ đồ hiện tại',
            override_alert: {
                title: 'Nhập cơ sở dữ liệu',
                content: {
                    alert: 'Việc nhập sơ đồ này sẽ ảnh hưởng đến các bảng và mối quan hệ hiện có.',
                    new_tables:
                        '<bold>{{newTablesNumber}}</bold> bảng mới sẽ được thêm vào.',
                    new_relationships:
                        '<bold>{{newRelationshipsNumber}}</bold> quan hệ mới sẽ được tạo.',
                    tables_override:
                        '<bold>{{tablesOverrideNumber}}</bold> bảng sẽ bị ghi đè.',
                    proceed: 'Bạn có muốn tiếp tục không?',
                },
                import: 'Nhập',
                cancel: 'Hủy',
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
            title: 'Xuất ảnh',
            description: 'Chọn tỉ lệ để xuất:',
            scale_1x: '1x (Chất lượng thấp)',
            scale_2x: '2x (Chất lượng bình thường)',
            scale_4x: '4x (Chất lượng tốt nhất)',
            cancel: 'Hủy',
            export: 'Xuất',
            advanced_options: 'Advanced Options',
            pattern: 'Include background pattern',
            pattern_description: 'Add subtle grid pattern to background.',
            transparent: 'Transparent background',
            transparent_description: 'Remove background color from image.',
        },

        new_table_schema_dialog: {
            title: 'Chọn lược đồ',
            description:
                'Nhiều lược đồ hiện đang được hiển thị. Chọn một lược đồ cho bảng mới.',
            cancel: 'Hủy',
            confirm: 'Xác nhận',
        },

        update_table_schema_dialog: {
            title: 'Thay đổi lược đồ',
            description: 'Cập nhật lược đồ bảng "{{tableName}}"',
            cancel: 'Hủy',
            confirm: 'Xác nhận',
        },

        create_table_schema_dialog: {
            title: 'Tạo lược đồ mới',
            description:
                'Chưa có lược đồ nào. Tạo lược đồ đầu tiên của bạn để tổ chức các bảng.',
            create: 'Tạo',
            cancel: 'Hủy',
        },

        star_us_dialog: {
            title: 'Hãy giúp chúng tôi cải thiện!',
            description:
                'Bạn có muốn ủng hộ chúng tôi bằng cách gắn sao trên GitHub không? Chỉ cần một cú nhấp chuột là được!',
            close: 'Chưa phải bây giờ',
            confirm: 'Dĩ nhiên rồi!',
        },
        export_diagram_dialog: {
            title: 'Xuất sơ đồ',
            description: 'Chọn định dạng để xuất:',
            format_json: 'JSON',
            cancel: 'Hủy',
            export: 'Xuất',
            error: {
                title: 'Lỗi khi xuất sơ đồ',
                description:
                    'Có gì đó không ổn. Cần trợ giúp? https://github.com/Lynn-Lee/SchemaFlow/issues',
            },
        },

        import_diagram_dialog: {
            title: 'Nhập sơ đồ',
            description: 'Dán sơ đồ ở dạng JSON bên dưới:',
            cancel: 'Hủy',
            import: 'Nhập',
            error: {
                title: 'Lỗi khi nhập sơ đồ',
                description:
                    'Sơ đồ ở dạng JSON không hợp lệ. Vui lòng kiểm tra JSON và thử lại. Bạn cần trợ giúp? https://github.com/Lynn-Lee/SchemaFlow/issues',
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
            one_to_one: 'Quan hệ một-một',
            one_to_many: 'Quan hệ một-nhiều',
            many_to_one: 'Quan hệ nhiều-một',
            many_to_many: 'Quan hệ nhiều-nhiều',
        },

        canvas_context_menu: {
            new_table: 'Tạo bảng mới',
            new_view: 'Chế độ xem Mới',
            new_relationship: 'Tạo quan hệ mới',
            new_area: 'Khu vực mới',
            new_note: 'Ghi Chú Mới',
        },

        table_node_context_menu: {
            edit_table: 'Sửa bảng',
            duplicate_table: 'Nhân đôi bảng',
            delete_table: 'Xóa bảng',
            add_relationship: 'Add Relationship',
            move_to_area: 'Di chuyển đến Khu vực',
            no_area: 'Không có Khu vực',
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
            all_tables_hidden: 'Tất cả bảng đã bị ẩn',
            show_all_tables: 'Hiển thị tất cả',
            mobile_notice: {
                title: 'Mobile editing is limited',
                description:
                    'For reliable canvas editing, use a desktop browser. You can continue on this device.',
                dismiss: 'Dismiss mobile canvas notice',
            },
        },

        canvas_filter: {
            title: 'Lọc bảng',
            search_placeholder: 'Tìm kiếm bảng...',
            group_by_schema: 'Nhóm theo Schema',
            group_by_area: 'Nhóm theo Khu vực',
            no_tables_found: 'Không tìm thấy bảng',
            empty_diagram_description: 'Tạo bảng để bắt đầu',
            no_tables_description:
                'Thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn',
            clear_filter: 'Xóa bộ lọc',
        },

        snap_to_grid_tooltip: 'Căn lưới (Giữ phím {{key}})',

        tool_tips: {
            double_click_to_edit: 'Nhấp đúp để chỉnh sửa',
        },

        language_select: {
            change_language: 'Ngôn ngữ',
        },

        on: 'Bật',
        off: 'Tắt',

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

export const viMetadata: LanguageMetadata = {
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    code: 'vi',
};
