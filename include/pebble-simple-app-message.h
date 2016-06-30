#pragma once
#include "@smallstoneapps/linked-list/linked-list.h"

typedef LinkedRoot StringDict;

StringDict* string_dict_create();
void string_dict_destroy(StringDict *this);

void string_dict_write_data(StringDict* this, char* key, uint16_t length, void* data);
void string_dict_write_null(StringDict* this, char* key);
void string_dict_write_bool(StringDict* this, char* key, bool val);
void string_dict_write_int(StringDict* this, char* key, int val);
void string_dict_write_string(StringDict* this, char* key, char* data);

void* string_dict_get(StringDict *this, char* key);
