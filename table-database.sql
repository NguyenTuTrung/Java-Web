use final
go

create table brand
(
    deleted      bit,
    id           int identity
        primary key,
    created_date datetime2(6),
    updated_date datetime2(6),
    code         varchar(255),
    name         nvarchar(255)
)
go

create unique index UKg7ft8mes72rnsk746b7ibyln2
    on brand (code)
    where [code] IS NOT NULL
go

create table collar
(
    deleted      bit,
    id           int identity
        primary key,
    created_date datetime2(6),
    updated_date datetime2(6),
    code         varchar(255),
    name         nvarchar(255)
)
go

create unique index UKmkxgqkhj5ndjpv1nvcfxdf7t3
    on collar (code)
    where [code] IS NOT NULL
go

create table color
(
    deleted      bit,
    id           int identity
        primary key,
    created_date datetime2(6),
    updated_date datetime2(6),
    code         varchar(255),
    name         nvarchar(255)
)
go

create unique index UKcbnc5ktj6whhh690w32k8cyh8
    on color (code)
    where [code] IS NOT NULL
go

create table elasticity
(
    deleted      bit,
    id           int identity
        primary key,
    created_date datetime2(6),
    updated_date datetime2(6),
    code         varchar(255),
    name         nvarchar(255)
)
go

create unique index UK8padggflv5sxp2u68ty11hx91
    on elasticity (code)
    where [code] IS NOT NULL
go

create table event
(
    discount_percent  int,
    id                int identity
        primary key,
    quantity_discount int,
    created_date      datetime2(6),
    end_date          datetime2(6),
    start_date        datetime2(6),
    updated_date      datetime2(6),
    discount_code     varchar(255),
    name              nvarchar(255),
    status            varchar(255)
)
go

create unique index UKgenmj627lt9fwmu97wf974o44
    on event (discount_code)
    where [discount_code] IS NOT NULL
go

create table image
(
    deleted      bit,
    id           int identity
        primary key,
    created_date datetime2(6),
    updated_date datetime2(6),
    code         varchar(255),
    url          varchar(255)
)
go

create unique index UKf8554665e4e0t819jc07asw22
    on image (code)
    where [code] IS NOT NULL
go

create table material
(
    deleted      bit,
    id           int identity
        primary key,
    created_date datetime2(6),
    updated_date datetime2(6),
    code         varchar(255),
    name         nvarchar(255)
)
go

create unique index UKt9kjl2b3iqg9sv9xe06fcxcya
    on material (code)
    where [code] IS NOT NULL
go

create table origin
(
    deleted      bit,
    id           int identity
        primary key,
    created_date datetime2(6),
    updated_date datetime2(6),
    code         varchar(255),
    name         nvarchar(255)
)
go

create unique index UK7e5g3f1j7w3jfye6tninigdro
    on origin (code)
    where [code] IS NOT NULL
go

create table product
(
    deleted      bit,
    id           int identity
        primary key,
    created_date datetime2(6),
    updated_date datetime2(6),
    code         varchar(255),
    description  nvarchar(255),
    name         nvarchar(255)
)
go

create table event_product
(
    event_id   int not null
        constraint FK4ad8tyf4bpqr6h821jh42uqxl
            references event,
    product_id int not null
        constraint FKntuxn8awf9tn7rxvximxbhb2x
            references product
)
go

create unique index UKh3w5r1mx6d0e5c6um32dgyjej
    on product (code)
    where [code] IS NOT NULL
go

create table role
(
    id           int identity
        primary key,
    created_date datetime2(6),
    updated_date datetime2(6),
    code         varchar(255),
    name         nvarchar(255)
)
go

create table account
(
    enabled      bit,
    id           int identity
        primary key,
    role_id      int
        constraint FKd4vb66o896tay3yy52oqxr9w0
            references role,
    created_date datetime2(6),
    updated_date datetime2(6),
    password     varchar(255),
    provider     varchar(255),
    social_id    varchar(255),
    status       varchar(255),
    username     varchar(255)
)
go

create unique index UKgex1lmaqpg0ir5g1f5eftyaa1
    on account (username)
    where [username] IS NOT NULL
go

create table customer
(
    account_id   int
        constraint FKn9x2k8svpxj3r328iy1rpur83
            references account,
    birth_date   date,
    deleted      bit,
    id           int identity
        primary key,
    created_date datetime2(6),
    updated_date datetime2(6),
    code         varchar(255),
    email        nvarchar(255),
    gender       nvarchar(255),
    name         nvarchar(255),
    phone        varchar(255),
    status       varchar(255)
)
go

create table address
(
    customer_id  int
        constraint FK93c3js0e22ll1xlu21nvrhqgg
            references customer,
    id           int identity
        primary key,
    is_default   bit,
    created_date datetime2(6),
    updated_date datetime2(6),
    detail       nvarchar(255),
    district     nvarchar(255),
    district_id  varchar(255),
    name         nvarchar(255),
    phone        varchar(255),
    province     nvarchar(255),
    province_id  varchar(255),
    ward         nvarchar(255),
    ward_id      varchar(255)
)
go

create unique index UKiw1xq6t67p4p17gr2d5dcrar1
    on customer (code, email, phone)
    where [code] IS NOT NULL AND [email] IS NOT NULL AND [phone] IS NOT NULL
go

create unique index UKjwt2qo9oj3wd7ribjkymryp8s
    on customer (account_id)
    where [account_id] IS NOT NULL
go

create unique index UKc36say97xydpmgigg38qv5l2p
    on role (code)
    where [code] IS NOT NULL
go

create table size
(
    deleted      bit,
    id           int identity
        primary key,
    created_date datetime2(6),
    updated_date datetime2(6),
    code         varchar(255),
    name         nvarchar(255)
)
go

create unique index UK2cl2qxxrob1p3d291xr99no9j
    on size (code)
    where [code] IS NOT NULL
go

create table sleeve
(
    deleted      bit,
    id           int identity
        primary key,
    created_date datetime2(6),
    updated_date datetime2(6),
    code         varchar(255),
    name         nvarchar(255)
)
go

create unique index UKxeixx6xuy44keusgk80bicdd
    on sleeve (code)
    where [code] IS NOT NULL
go

create table staff
(
    account_id   int
        constraint FKs9jl798sgmtrl79dm4svocvaw
            references account,
    birth_day    date,
    deleted      bit,
    gender       bit,
    id           int identity
        primary key,
    created_date datetime2(6),
    updated_date datetime2(6),
    address      nvarchar(255),
    citizen_id   varchar(255),
    code         varchar(255),
    district     nvarchar(255),
    email        varchar(255),
    name         nvarchar(255),
    note         nvarchar(255),
    phone        varchar(255),
    province     nvarchar(255),
    status       varchar(255),
    ward         nvarchar(255)
)
go

create unique index UKr4h7xlxecyyylk0xdc7u0f7lf
    on staff (code, email, phone)
    where [code] IS NOT NULL AND [email] IS NOT NULL AND [phone] IS NOT NULL
go

create unique index UK4uqyb8awsv3mfncjj737o7oo9
    on staff (account_id)
    where [account_id] IS NOT NULL
go

create table style
(
    deleted      bit,
    id           int identity
        primary key,
    created_date datetime2(6),
    updated_date datetime2(6),
    code         varchar(255),
    name         nvarchar(255)
)
go

create unique index UKqiy003f5r7e6ey7l5y3apiu76
    on style (code)
    where [code] IS NOT NULL
go

create table texture
(
    deleted      bit,
    id           int identity
        primary key,
    created_date datetime2(6),
    updated_date datetime2(6),
    code         varchar(255),
    name         nvarchar(255)
)
go

create unique index UKltw1388iiex1fh3yyexn8ll9s
    on texture (code)
    where [code] IS NOT NULL
go

create table thickness
(
    deleted      bit,
    id           int identity
        primary key,
    created_date datetime2(6),
    updated_date datetime2(6),
    code         varchar(255),
    name         nvarchar(255)
)
go

create table product_detail
(
    brand_id      int
        constraint FKn29xx33y0vxapbc6ntf4kldxr
            references brand,
    collar_id     int
        constraint FKrs2l68eovv4jbptsnrw9xxk29
            references collar,
    color_id      int
        constraint FK99vj2np1gk1robp8n6htiweii
            references color,
    deleted       bit,
    elasticity_id int
        constraint FKebv5c5kn3d3sxjjken6xm8ewa
            references elasticity,
    id            int identity
        primary key,
    mass          int,
    material_id   int
        constraint FKelrbk54wt31vv07h3us1gap2c
            references material,
    origin_id     int
        constraint FKnb3b3wpn7hlkbs5o6vhonn46c
            references origin,
    price         float,
    product_id    int
        constraint FKilxoi77ctyin6jn9robktb16c
            references product,
    quantity      int,
    size_id       int
        constraint FKcum8u2vfvebmmc4xo8de3k35s
            references size,
    sleeve_id     int
        constraint FKaulbngl3gskh8tll54wyh5ckg
            references sleeve,
    style_id      int
        constraint FK56s4hqmp09omp2w84hijq3jyc
            references style,
    texture_id    int
        constraint FKkk0ba59xpfjat6ceh4fms3ljw
            references texture,
    thickness_id  int
        constraint FKo97vo0ox06s9fp5dxh6dq2san
            references thickness,
    created_date  datetime2(6),
    updated_date  datetime2(6),
    code          varchar(255)
)
go

create unique index UKndx952w0v9kxawibxhciotx1w
    on product_detail (code)
    where [code] IS NOT NULL
go

create table product_detail_image
(
    image_id          int not null
        constraint FK6lmrllls0dulie6lcmcmben99
            references image,
    product_detail_id int not null
        constraint FKskyg70b8gibcihqttosjjsihb
            references product_detail
)
go

create unique index UKnkdkv6j2y4egsd7j34hf0xbvt
    on thickness (code)
    where [code] IS NOT NULL
go

create table tokens
(
    account_id              int
        constraint FKt48bf1bs3xikgfg8wtyajf9wj
            references account,
    expired                 bit          not null,
    id                      int identity
        primary key,
    is_mobile               bit          not null,
    revoked                 bit          not null,
    created_date            datetime2(6),
    expiration_date         datetime2(6) not null,
    refresh_expiration_date datetime2(6) not null,
    updated_date            datetime2(6),
    token_type              varchar(50),
    refresh_token           varchar(255),
    token                   varchar(255) not null
)
go

create table voucher
(
    deleted      bit,
    id           int identity
        primary key,
    max_percent  int,
    min_amount   int,
    quantity     int,
    created_date datetime2(6),
    end_date     datetime2(6),
    start_date   datetime2(6),
    updated_date datetime2(6),
    code         varchar(255),
    name         nvarchar(255),
    status       varchar(255),
    type_ticket  varchar(255)
        check ([type_ticket] = 'Everybody' OR [type_ticket] = 'Individual')
)
go

create table cart
(
    customer_id    int
        constraint FKdebwvad6pp1ekiqy5jtixqbaj
            references customer,
    deleted        bit,
    delivery_fee   float,
    discount       float,
    district_id    int,
    id             int identity
        primary key,
    province_id    int,
    sub_total      float,
    total          float,
    voucher_id     int
        constraint FKc251mbx6hw7613vnknobredv2
            references voucher,
    created_date   datetime2(6),
    updated_date   datetime2(6),
    address        nvarchar(255),
    code           varchar(255),
    district_name  nvarchar(255),
    email          nvarchar(255),
    payment        varchar(255)
        check ([payment] = 'TRANSFER' OR [payment] = 'CASH'),
    phone          nvarchar(255),
    province_name  nvarchar(255),
    recipient_name nvarchar(255),
    status         varchar(255)
        check ([status] = 'PENDING' OR [status] = 'TOSHIP' OR [status] = 'SUCCESS'),
    type           varchar(255)
        check ([type] = 'INSTORE' OR [type] = 'ONLINE'),
    ward_id        varchar(255),
    ward_name      nvarchar(255)
)
go

create table cart_detail
(
    cart_id           int
        constraint FKrg4yopd2252nwj8bfcgq5f4jp
            references cart,
    id                int identity
        primary key,
    product_detail_id int
        constraint FK3c8gudcdnngwh5k2g2n25kkqk
            references product_detail,
    quantity          int,
    created_date      datetime2(6),
    updated_date      datetime2(6),
    code              varchar(255)
)
go

create unique index UKen0126g6bmglbwsbk87omyu7x
    on cart_detail (code)
    where [code] IS NOT NULL
go

create table orders
(
    customer_id                       int
        constraint FK624gtjin3po807j3vix093tlf
            references customer,
    deleted                           bit,
    delivery_fee                      float,
    discount                          float,
    discount_voucher_percent          float,
    district_id                       int,
    id                                int identity
        primary key,
    in_store                          bit,
    is_payment                        bit,
    province_id                       nvarchar(255),
    staff_id                          int
        constraint FK4ery255787xl56k025fyxrqe9
            references staff,
    sub_total                         float,
    total                             float,
    total_paid                        float,
    voucher_id                        int
        constraint FKrx5vk9ur428660yp19hw98nr2
            references voucher,
    voucher_minimum_subtotal_required float,
    created_date                      datetime2(6),
    updated_date                      datetime2(6),
    address                           nvarchar(255),
    code                              varchar(255),
    district_name                     nvarchar(255),
    email                             varchar(255),
    payment                           varchar(255)
        check ([payment] = 'TRANSFER' OR [payment] = 'CASH'),
    phone                             varchar(255),
    province_name                     nvarchar(255),
    recipient_name                    nvarchar(255),
    status                            varchar(255)
        check ([status] = 'REQUESTED' OR [status] = 'CANCELED' OR [status] = 'DELIVERED' OR [status] = 'TORECEIVE' OR
               [status] = 'TOSHIP' OR [status] = 'PENDING'),
    type                              varchar(255)
        check ([type] = 'INSTORE' OR [type] = 'ONLINE'),
    ward_id                           varchar(255),
    ward_name                         nvarchar(255)
)
go

create table history
(
    account_id   int
        constraint FK2mpn4nxqqsu7euii4hwhbjeg8
            references account,
    id           int identity
        primary key,
    order_id     int
        constraint FKh67g7uf13wwtr5ar270qti86f
            references orders,
    created_date datetime2(6),
    updated_date datetime2(6),
    note         nvarchar(255),
    status       varchar(255)
        check ([status] = 'REQUESTED' OR [status] = 'CANCELED' OR [status] = 'DELIVERED' OR [status] = 'TORECEIVE' OR
               [status] = 'TOSHIP' OR [status] = 'PENDING')
)
go

create table order_detail
(
    average_discount_event float,
    deleted                bit,
    id                     int identity
        primary key,
    order_id               int
        constraint FKrws2q0si6oyd6il8gqe2aennc
            references orders,
    product_detail_id      int
        constraint FK4onmghajt9jh9quh6ed3lipdn
            references product_detail,
    quantity               int,
    created_date           datetime2(6),
    updated_date           datetime2(6)
)
go

create unique index UKgt3o4a5bqj59e9y6wakgk926t
    on orders (code)
    where [code] IS NOT NULL
go

create unique index UKpvh1lqheshnjoekevvwla03xn
    on voucher (code)
    where [code] IS NOT NULL
go

create table voucher_customer
(
    customer_id int not null
        constraint FK4v69n165aqbdx77mwtikkmbfq
            references customer,
    voucher_id  int not null
        constraint FK1x9wxfsp0n58p1394phab9uko
            references voucher
)
go

