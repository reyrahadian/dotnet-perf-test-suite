import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    thresholds: {
        // During the whole test execution, the error rate must be lower than 10%.
        http_req_failed: [{threshold: 'rate<0.1', abortOnFail: true}]
    },
    stages: [
        {duration: '10s', target: 1},
        {duration: '1m', target: 5},
        {duration: '1h', target: 5}
    ]
};

export default async function () {
    const responses = http.batch([
        ['GET', 'http://app1.localhost/api/v1/home/products/tiles?itemCodes=I-015503', null, params],
        ['GET', 'http://app1.localhost/api/v1/home/products/tiles?itemCodes=I-060546', null, params],
        ['GET', 'http://app1.localhost/api/v1/home/wishlist/items', null, params],
        ['GET', 'http://app2.localhost/api/v1/home/products/tiles?itemCodes=I-015503', null, params],
        ['GET', 'http://app2.localhost/api/v1/home/products/tiles?itemCodes=I-060546', null, params],
        ['GET', 'http://app2.localhost/api/v1/home/wishlist/items', null, params]
    ]);
    responses.forEach(response => {
        check(response, { 'status was 200': (r) => r.status == 200 });
    });

    sleep(1);
}