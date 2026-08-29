import {apiRequest} from './apiClient';

export async function getGuestStays(){
    return apiRequest('/guest-stays');
}